from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, PlainTextResponse
from pydantic import BaseModel
from typing import Literal, Optional
import logging
import tempfile
import shutil
import os

# Import token counter modules
from google_token import get_google_tokens
from openai_token import num_tokens_from_string
from claude_token import estimate_claude_tokens
from pdf_extractor import PDFExtractor

app = FastAPI(
    title="Token Calculator API",
    description=(
        "Count tokens for Google (Gemini), OpenAI (GPT), and Anthropic (Claude) models. "
        "Supports plain text prompts, PDF uploads, or both combined."
    ),
    version="1.2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

from routes.auth_routes import router as auth_router
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])

from routes.model_routes import router as model_router
app.include_router(model_router, prefix="/api/models", tags=["Models"])

from routes.playground_routes import router as playground_router
app.include_router(playground_router, prefix="/api/playground", tags=["Playground"])

from routes.usage_routes import router as usage_router
app.include_router(usage_router, prefix="/api/usage", tags=["Usage"])

from routes.analytics_routes import router as analytics_router
app.include_router(analytics_router, prefix="/api/analytics", tags=["Analytics"])

# ─── Request / Response Models ────────────────────────────────────────────────

class TokenRequest(BaseModel):
    provider: Literal["google", "openai", "claude"]
    model: str
    text: str

class TokenResponse(BaseModel):
    provider: str
    model: str
    token_count: int
    note: str | None = None


# ─── Helper: extract text from an uploaded PDF ────────────────────────────────

async def _pdf_to_text(file: UploadFile) -> str:
    """Save the uploaded PDF to a temp file, extract all text, then clean up."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name

        extractor = PDFExtractor(
            pdf_path=tmp_path,
            extract_images=True,
            run_ocr=True,
            save_images_to=None,
        )
        content = extractor.extract()
        return PDFExtractor.to_plain_text(content, display_name=file.filename)

    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"PDF extraction error [{file.filename}]: {e}")
        raise HTTPException(status_code=500, detail=f"PDF extraction failed: {str(e)}")
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)


# ─── Helper: dispatch token counting by provider ─────────────────────────────

def _count(provider: str, model: str, text: str) -> TokenResponse:
    if provider == "google":
        count = get_google_tokens(text=text, model=model)
        return TokenResponse(provider="google", model=model, token_count=count)

    elif provider == "openai":
        count = num_tokens_from_string(string=text, model_name=model)
        return TokenResponse(provider="openai", model=model, token_count=count)

    elif provider == "claude":
        count = estimate_claude_tokens(text=text)
        return TokenResponse(
            provider="claude",
            model=model,
            token_count=count,
            note="Token count is an offline approximation using cl100k_base encoding (±1-5% of actual Claude tokens).",
        )

    raise HTTPException(status_code=400, detail=f"Unknown provider: {provider}")


# ─── Unified Endpoint (text + PDF combined) ───────────────────────────────────

@app.post("/count_tokens_unified", response_model=TokenResponse, tags=["Tokens"])
async def count_tokens_unified(
    provider: Literal["google", "openai", "claude"] = Form(..., description="LLM provider"),
    model: str = Form(..., description="Model name (e.g. gemini-2.5-flash, gpt-4o, claude-3-5-sonnet-20241022)"),
    prompt: Optional[str] = Form(None, description="Text prompt (optional if PDF is provided)"),
    file: Optional[UploadFile] = File(None, description="PDF file (optional if prompt is provided)"),
):
    """
    **Unified token counter** that accepts any combination of inputs:

    | Scenario | prompt | file |
    |---|---|---|
    | Text only | ✅ required | ❌ omit |
    | PDF only  | ❌ omit | ✅ required |
    | Text + PDF | ✅ required | ✅ required |

    When both are supplied the PDF text is appended to the prompt before counting.
    """
    # --- validate: at least one input must be present ---
    has_prompt = bool(prompt and prompt.strip())
    has_file   = file is not None and file.filename

    if not has_prompt and not has_file:
        raise HTTPException(
            status_code=422,
            detail="Provide at least one of: 'prompt' (text) or 'file' (PDF).",
        )

    combined_text = ""

    # 1. Add prompt text
    if has_prompt:
        combined_text += prompt.strip()

    # 2. Extract PDF and append
    if has_file:
        pdf_text = await _pdf_to_text(file)
        if combined_text:
            combined_text += "\n\n" + pdf_text
        else:
            combined_text = pdf_text

    if not combined_text.strip():
        raise HTTPException(status_code=422, detail="The provided inputs yielded no text to count.")

    try:
        return _count(provider=provider, model=model, text=combined_text)
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Token counting error [{provider}:{model}]: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ─── Legacy JSON endpoint (text-only) ────────────────────────────────────────

@app.post("/count_tokens", response_model=TokenResponse, tags=["Tokens"])
def count_tokens(request: TokenRequest):
    """
    **(Legacy)** Count tokens from plain text via JSON body.

    - **provider**: `google` | `openai` | `claude`
    - **model**: Model name
    - **text**: The prompt / input text
    """
    try:
        return _count(provider=request.provider, model=request.model, text=request.text)
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Token counting error [{request.provider}:{request.model}]: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ─── PDF Extraction Endpoint ──────────────────────────────────────────────────

@app.post("/extract_pdf", tags=["PDF"])
async def extract_pdf(
    file: UploadFile = File(..., description="PDF file to extract content from"),
):
    """
    Upload a PDF and get all its content as plain text.

    Always extracts everything automatically:
    - Native text (digital PDFs)
    - Tables (formatted as pipe-separated rows)
    - Annotations / highlights
    - OCR via Tesseract for scanned/image-only pages (requires Tesseract installed)
    """
    plain_text = await _pdf_to_text(file)
    return PlainTextResponse(content=plain_text)


# ─── Run ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
