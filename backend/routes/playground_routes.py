from fastapi import APIRouter, Body, HTTPException, status, UploadFile, File, Request
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from core.database import db, usage_collection
from core.database import db as _db
from bson import ObjectId
from pdf_extractor import PDFExtractor
from core.security import SECRET_KEY, ALGORITHM
from jose import jwt, JWTError
from datetime import datetime, timezone
import tempfile
import shutil
import os
import httpx
import logging
import time

router = APIRouter()
model_collection = db.get_collection("models")
prompt_logs_col  = db.get_collection("prompt_logs")


def _get_user_from_request(request: Request) -> Optional[dict]:
    """Decode JWT from Authorization header. Returns dict with email/persona/department or None."""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    token = auth_header[7:]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {
            "email":      payload.get("sub"),
            "persona":    payload.get("persona"),
            "department": payload.get("department", ""),
        }
    except JWTError:
        return None


async def _record_usage(
    user_email: str,
    user_persona: str,
    user_department: str,
    model_db_id: str,
    model_name: str,
    model_id: str,
    provider: str,
    prompt_tokens: int,
    completion_tokens: int,
):
    """
    Upsert token-only usage into two collections:
      1. usage_records  — one doc per (user_email, model_db_id), lifetime running totals.
      2. usage_daily    — one doc per (user_email, model_db_id, date), for timeline charts.
    Cost is NOT stored here — it is computed at query time from the models collection.
    """
    total_tokens = prompt_tokens + completion_tokens
    now  = datetime.now(timezone.utc)
    date = now.strftime("%Y-%m-%d")

    # ── 1. Lifetime aggregate (one doc per user+model) ──────────────────────
    lifetime_filter = {
        "user_email":  user_email,
        "model_db_id": model_db_id,
    }
    lifetime_update = {
        "$inc": {
            "prompt_tokens":     prompt_tokens,
            "completion_tokens": completion_tokens,
            "total_tokens":      total_tokens,
            "request_count":     1,
        },
        "$set": {
            "user_persona":     user_persona,
            "user_department":  user_department,
            "model_name":       model_name,
            "model_id":         model_id,
            "provider":         provider,
            "last_used":        now,
        },
        "$setOnInsert": {
            "first_used": now,
        },
    }

    # ── 2. Daily aggregate (one doc per user+model+date) ────────────────────
    daily_filter = {
        "user_email":  user_email,
        "model_db_id": model_db_id,
        "date":        date,
    }
    daily_update = {
        "$inc": {
            "prompt_tokens":     prompt_tokens,
            "completion_tokens": completion_tokens,
            "total_tokens":      total_tokens,
            "request_count":     1,
        },
        "$set": {
            "model_name":      model_name,
            "provider":        provider,
            "user_persona":    user_persona,
            "user_department": user_department,
        },
        "$setOnInsert": {
            "created_at": now,
        },
    }

    try:
        usage_daily_collection = _db.get_collection("usage_daily")
        await usage_collection.update_one(lifetime_filter, lifetime_update, upsert=True)
        await usage_daily_collection.update_one(daily_filter, daily_update, upsert=True)
    except Exception as e:
        logging.error(f"Failed to update usage record: {e}")


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    modelId: str
    messages: List[Message]
    hyperparameters: Optional[Dict[str, Any]] = None
    guardrailModelId: Optional[str] = None


@router.post("/upload_context", response_description="Extract text from a file for context")
async def playground_upload(file: UploadFile = File(...)):
    ext = file.filename.lower().split('.')[-1]
    if ext not in ["pdf", "txt"]:
        raise HTTPException(status_code=400, detail="Only PDF or TXT files are accepted.")

    if ext == "txt":
        content = await file.read()
        return {"filename": file.filename, "text": content.decode("utf-8", errors="replace")}

    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name

        extractor = PDFExtractor(pdf_path=tmp_path, extract_images=False, run_ocr=True, save_images_to=None)
        content = extractor.extract()
        text = PDFExtractor.to_plain_text(content, display_name=file.filename)
        return {"filename": file.filename, "text": text}
    except Exception as e:
        logging.error(f"PDF extraction error [{file.filename}]: {e}")
        raise HTTPException(status_code=500, detail=f"PDF extraction failed: {str(e)}")
    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except Exception:
                pass


@router.post("/chat", response_description="Chat with an onboarded model")
async def playground_chat(request: Request, body: ChatRequest = Body(...)):
    # 1. Identify user from JWT
    user = _get_user_from_request(request)

    # 2. Fetch model from DB
    if not ObjectId.is_valid(body.modelId):
        raise HTTPException(status_code=400, detail="Invalid model ID")

    model = await model_collection.find_one({"_id": ObjectId(body.modelId)})
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    provider = model.get("provider", "").lower()
    model_link = model.get("modelLink")
    model_name_id = model.get("modelId", "")
    model_name = model.get("name", model_name_id)
    input_pricing = float(model.get("inputPricing") or 0)
    output_pricing = float(model.get("outputPricing") or 0)

    if not model_link:
        raise HTTPException(status_code=400, detail="Model does not have a configured endpoint link.")

    # 3. Normalize Ollama endpoint
    if "api/chat" not in model_link:
        endpoint = f"{model_link}/chat" if model_link.endswith("/api") else f"{model_link}/api/chat"
    else:
        endpoint = model_link

    # 4. Build payload
    payload = {
        "model": model_name_id.strip() if model_name_id else "",
        "messages": [msg.model_dump() for msg in body.messages],
        "stream": False
    }

    # 5. Hyperparameters
    options = {}
    if body.hyperparameters:
        for hp in model.get("hyperparams", []):
            key = hp.get("label")
            if key in body.hyperparameters:
                try:
                    val = body.hyperparameters[key]
                    if hp.get("type") == "Integer":
                        options[key] = int(val)
                    elif hp.get("type") == "Float":
                        options[key] = float(val)
                    elif hp.get("type") == "Boolean":
                        options[key] = bool(val)
                except ValueError:
                    pass

    if options:
        payload["options"] = options

    # 6. Extract user prompt
    user_prompt_text = ""
    for msg in body.messages:
        if msg.role == "user":
            user_prompt_text = msg.content

    # 7. GUARDRAIL CHECK
    guardrail_hits = []
    if body.guardrailModelId and ObjectId.is_valid(body.guardrailModelId):
        g_model = await model_collection.find_one({"_id": ObjectId(body.guardrailModelId)})
        if g_model:
            g_provider = g_model.get("provider", "").lower()
            g_model_link = g_model.get("modelLink")
            g_model_name_id = g_model.get("modelId", "")
            g_model_name = g_model.get("name", g_model_name_id)

            if "api/chat" not in g_model_link:
                g_endpoint = f"{g_model_link}/chat" if g_model_link.endswith("/api") else f"{g_model_link}/api/chat"
            else:
                g_endpoint = g_model_link

            guardrail_sys_prompt = (
                "You are a STRICT content safety monitor. Your ONLY job is to classify the user's text into one or more of the following violation categories. Be extremely harsh. If the text contains ANY swear words, offensive slurs, or vulgar language, you MUST flag it as OBSCENITY_AND_PROFANITY or HATE_SPEECH.\n\n"
                "CATEGORIES:\n"
                "- DANGEROUS_CONTENT: Promotes or enables harmful activities, violence, or illegal acts.\n"
                "- PII_SOLICITING_RECITING: Solicits or recites Sensitive Personal Information.\n"
                "- HARASSMENT: Malicious, intimidating, or abusive towards individuals/groups.\n"
                "- SEXUALLY_EXPLICIT: Contains sexually explicit or highly suggestive content.\n"
                "- HATE_SPEECH: Includes racial slurs, hateful statements, or bigotry.\n"
                "- MEDICAL_INFO: Provides direct medical guidance or harmful health advice.\n"
                "- VIOLENCE_AND_GORE: Graphic descriptions of violence or gore.\n"
                "- OBSCENITY_AND_PROFANITY: ANY use of swear words, profanity, vulgarity, or offensive language (e.g. f-words, n-words, b-words, etc.).\n\n"
                "INSTRUCTIONS:\n"
                "1. If you detect ANY violations, return ONLY a comma-separated list of the category names (e.g. 'OBSCENITY_AND_PROFANITY, HATE_SPEECH').\n"
                "2. If the text is completely benign and safe, return 'SAFE'.\n"
                "3. DO NOT output any other text, reasoning, or apology.\n\n"
                f"TEXT TO ANALYZE:\n\"{user_prompt_text}\""
            )
            g_payload = {
                "model": g_model_name_id.strip() if g_model_name_id else "",
                "messages": [{"role": "user", "content": guardrail_sys_prompt}],
                "stream": False
            }

            gt0 = time.monotonic()
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    g_res = await client.post(g_endpoint, json=g_payload)
                    g_res.raise_for_status()

                    import json
                    g_raw = g_res.text.strip()
                    g_lines = [line for line in g_raw.splitlines() if line.strip()]
                    g_last = {}
                    for line in g_lines:
                        try:
                            g_last = json.loads(line)
                        except Exception: pass
                    g_first = {}
                    try:
                        g_first = json.loads(g_lines[0]) if g_lines else {}
                    except Exception: pass

                    g_content = g_last.get("message", {}).get("content") or g_first.get("message", {}).get("content", "")
                    
                    logging.info(f"--- GUARDRAIL RAW RESPONSE ---")
                    logging.info(f"Model ID: {g_model_name_id}")
                    logging.info(f"Full text: {g_raw}")
                    logging.info(f"Extracted content: {g_content}")
                    logging.info(f"------------------------------")
                    
                    g_p_toks = g_last.get("prompt_eval_count", 0) or 0
                    g_c_toks = g_last.get("eval_count", 0) or 0
                    
                    # Log guardrail model usage
                    if user and user.get("email"):
                        await _record_usage(
                            user_email=user["email"],
                            user_persona=user.get("persona", ""),
                            user_department=user.get("department", ""),
                            model_db_id=str(g_model["_id"]),
                            model_name=g_model_name,
                            model_id=g_model_name_id.strip(),
                            provider=g_provider,
                            prompt_tokens=g_p_toks,
                            completion_tokens=g_c_toks,
                        )

                    g_content_upper = g_content.upper()
                    possible_hits = [
                        "DANGEROUS_CONTENT", "PII_SOLICITING_RECITING", "HARASSMENT", 
                        "SEXUALLY_EXPLICIT", "HATE_SPEECH", "MEDICAL_INFO", 
                        "VIOLENCE_AND_GORE", "OBSCENITY_AND_PROFANITY"
                    ]
                    for hit in possible_hits:
                        if hit in g_content_upper:
                            guardrail_hits.append(hit)
            except Exception as e:
                logging.warning(f"Guardrail check failed: {e}")

    # If guardrail hit, block early!
    if len(guardrail_hits) > 0:
        assistant_content = f"Blocked by guardrails: {', '.join(guardrail_hits)}"
        try:
            await prompt_logs_col.insert_one({
                "timestamp":       datetime.now(timezone.utc),
                "model_name":      model_name,
                "model_db_id":     str(model["_id"]),
                "provider":        provider,
                "user_email":      user.get("email", "") if user else "",
                "user_persona":    user.get("persona", "") if user else "",
                "prompt":          user_prompt_text,
                "response":        assistant_content,
                "tokens_in":       0,
                "tokens_out":      0,
                "latency_ms":      0,
                "cost_usd":        0,
                "guardrail_hits":  guardrail_hits,
                "error":           "Blocked by Guardrails",
            })
        except Exception as log_err:
            logging.warning(f"Failed to write prompt log for guardrail block: {log_err}")

        return {
            "role": "assistant",
            "content": assistant_content,
            "provider": provider,
            "usage": { "prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0 }
        }


    t0 = time.monotonic()
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(endpoint, json=payload)
            response.raise_for_status()

            # Ollama can return multiple JSON lines (streaming=false still may do this)
            # We collect all lines and take the LAST one (which has done:true and token counts)
            raw_text = response.text.strip()
            lines = [line for line in raw_text.splitlines() if line.strip()]

            import json
            last_data = {}
            for line in lines:
                try:
                    last_data = json.loads(line)
                except Exception:
                    pass

            # Extract token counts from the final "done" chunk
            prompt_tokens = last_data.get("prompt_eval_count", 0) or 0
            completion_tokens = last_data.get("eval_count", 0) or 0

            # Extract the assistant message (first chunk typically has message content)
            first_data = {}
            try:
                first_data = json.loads(lines[0]) if lines else {}
            except Exception:
                pass

            # The message content may be spread across chunks; use last_data or first_data
            assistant_role = last_data.get("message", {}).get("role") or first_data.get("message", {}).get("role", "assistant")
            assistant_content = last_data.get("message", {}).get("content") or first_data.get("message", {}).get("content", "")

            latency_ms = round((time.monotonic() - t0) * 1000, 1)

            # Cost estimation (per 1K tokens)
            cost_usd = round(
                (prompt_tokens / 1000) * input_pricing +
                (completion_tokens / 1000) * output_pricing,
                8
            )

            # 6. Record usage (token counts only — no pricing stored)
            if user and user.get("email"):
                await _record_usage(
                    user_email=user["email"],
                    user_persona=user.get("persona", ""),
                    user_department=user.get("department", ""),
                    model_db_id=str(model["_id"]),
                    model_name=model_name,
                    model_id=model_name_id.strip(),
                    provider=provider,
                    prompt_tokens=prompt_tokens,
                    completion_tokens=completion_tokens,
                )

            # 7. Write to prompt_logs for analytics viewer
            user_prompt_text = ""
            for msg in body.messages:
                if msg.role == "user":
                    user_prompt_text = msg.content  # last user message
            try:
                await prompt_logs_col.insert_one({
                    "timestamp":       datetime.now(timezone.utc),
                    "model_name":      model_name,
                    "model_db_id":     str(model["_id"]),
                    "provider":        provider,
                    "user_email":      user.get("email", "") if user else "",
                    "user_persona":    user.get("persona", "") if user else "",
                    "prompt":          user_prompt_text,
                    "response":        assistant_content,
                    "tokens_in":       prompt_tokens,
                    "tokens_out":      completion_tokens,
                    "latency_ms":      latency_ms,
                    "cost_usd":        cost_usd,
                    "guardrail_hits":  guardrail_hits,
                    "error":           None,
                })
            except Exception as log_err:
                logging.warning(f"Failed to write prompt log: {log_err}")

            return {
                "role": assistant_role,
                "content": assistant_content,
                "provider": provider,
                "usage": {
                    "prompt_tokens": prompt_tokens,
                    "completion_tokens": completion_tokens,
                    "total_tokens": prompt_tokens + completion_tokens,
                }
            }

    except httpx.RequestError as exc:
        logging.error(f"An error occurred while requesting {exc.request.url!r}.")
        raise HTTPException(status_code=502, detail=f"Failed to connect to model endpoint: {str(exc)}")
    except httpx.HTTPStatusError as exc:
        logging.error(f"Error response {exc.response.status_code} while requesting {exc.request.url!r}.")
        raise HTTPException(status_code=exc.response.status_code, detail=f"Model endpoint returned error: {exc.response.text}")

