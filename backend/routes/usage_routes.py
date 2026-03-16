from fastapi import APIRouter, Query
from core.database import usage_collection, db as _db
from datetime import datetime, timezone, timedelta
from bson import ObjectId
from typing import Optional

router = APIRouter()

# Cache pricing per model_db_id within a request context to avoid redundant DB calls
async def _get_pricing_map() -> dict:
    """Return {model_db_id: {input: float, output: float}} from models collection."""
    model_col = _db.get_collection("models")
    pricing = {}
    async for m in model_col.find({}, {"_id": 1, "inputPricing": 1, "outputPricing": 1}):
        pricing[str(m["_id"])] = {
            "input":  float(m.get("inputPricing") or 0),
            "output": float(m.get("outputPricing") or 0),
        }
    return pricing


def _calc_cost(prompt_tokens: int, completion_tokens: int, pricing: dict, model_db_id: str) -> dict:
    """Calculate cost from token counts.
    DB stores inputPricing / outputPricing as USD per 1,000 tokens.
    """
    p = pricing.get(model_db_id, {"input": 0, "output": 0})
    input_cost  = (prompt_tokens     / 1_000) * p["input"]
    output_cost = (completion_tokens / 1_000) * p["output"]
    return {
        "input_pricing_per_1k":  p["input"],
        "output_pricing_per_1k": p["output"],
        "input_cost_usd":        round(input_cost, 8),
        "output_cost_usd":       round(output_cost, 8),
        "total_cost_usd":        round(input_cost + output_cost, 8),
    }


def _since(days: int) -> datetime:
    return datetime.now(timezone.utc) - timedelta(days=days)


def _serial_dt(doc: dict) -> dict:
    for key in ("last_used", "first_used", "created_at"):
        if isinstance(doc.get(key), datetime):
            doc[key] = doc[key].isoformat()
    return doc


# ─── Summary: one row per (user, model) ──────────────────────────────────────
@router.get("/summary")
async def usage_summary(
    days: int = Query(30),
    user_email: Optional[str] = Query(None),
    model_id: Optional[str] = Query(None),
):
    pricing = await _get_pricing_map()
    query: dict = {"last_used": {"$gte": _since(days)}}
    if user_email:
        query["user_email"] = user_email
    if model_id:
        query["model_db_id"] = model_id

    pipeline = [
        {"$match": query},
        {"$lookup": {
            "from": "users",
            "localField": "user_email",
            "foreignField": "email",
            "as": "user_doc"
        }},
        {"$unwind": {"path": "$user_doc", "preserveNullAndEmptyArrays": True}},
        {"$addFields": {
            "user_department": {"$ifNull": ["$user_doc.department", {"$ifNull": ["$user_department", "Unassigned"]}]}
        }},
        {"$project": {"user_doc": 0}},
        {"$sort": {"total_tokens": -1}}
    ]

    docs = []
    async for doc in usage_collection.aggregate(pipeline):
        doc["_id"] = str(doc["_id"])
        cost = _calc_cost(
            doc.get("prompt_tokens", 0),
            doc.get("completion_tokens", 0),
            pricing,
            doc.get("model_db_id", "")
        )
        doc.update(cost)
        docs.append(_serial_dt(doc))
    return docs


# ─── By Model ─────────────────────────────────────────────────────────────────
@router.get("/by-model")
async def usage_by_model(days: int = Query(30)):
    pricing = await _get_pricing_map()

    pipeline = [
        {"$match": {"last_used": {"$gte": _since(days)}}},
        {"$group": {
            "_id": {"model_name": "$model_name", "model_db_id": "$model_db_id", "provider": "$provider"},
            "prompt_tokens":     {"$sum": "$prompt_tokens"},
            "completion_tokens": {"$sum": "$completion_tokens"},
            "total_tokens":      {"$sum": "$total_tokens"},
            "request_count":     {"$sum": "$request_count"},
            "unique_users":      {"$addToSet": "$user_email"},
        }},
        {"$sort": {"total_tokens": -1}},
    ]

    results = []
    async for doc in usage_collection.aggregate(pipeline):
        mid = doc["_id"].get("model_db_id", "")
        cost = _calc_cost(doc["prompt_tokens"], doc["completion_tokens"], pricing, mid)
        results.append({
            "model_name":        doc["_id"]["model_name"],
            "model_db_id":       mid,
            "provider":          doc["_id"]["provider"],
            "prompt_tokens":     doc["prompt_tokens"],
            "completion_tokens": doc["completion_tokens"],
            "total_tokens":      doc["total_tokens"],
            "request_count":     doc["request_count"],
            "unique_users":      len(doc["unique_users"]),
            **cost,
        })
    return results


# ─── By User ──────────────────────────────────────────────────────────────────
@router.get("/by-user")
async def usage_by_user(days: int = Query(30)):
    pricing = await _get_pricing_map()

    pipeline = [
        {"$match": {"last_used": {"$gte": _since(days)}}},
        {"$group": {
            "_id": {"user_email": "$user_email", "user_persona": "$user_persona"},
            "rows": {"$push": {
                "model_db_id":       "$model_db_id",
                "prompt_tokens":     "$prompt_tokens",
                "completion_tokens": "$completion_tokens",
            }},
            "total_tokens":  {"$sum": "$total_tokens"},
            "request_count": {"$sum": "$request_count"},
            "models_used":   {"$addToSet": "$model_name"},
            "last_used":     {"$max": "$last_used"},
        }},
        {"$sort": {"total_tokens": -1}},
    ]

    results = []
    async for doc in usage_collection.aggregate(pipeline):
        # Compute costs per row then sum
        total_input_cost = total_output_cost = 0.0
        for row in doc["rows"]:
            c = _calc_cost(row["prompt_tokens"], row["completion_tokens"], pricing, row["model_db_id"])
            total_input_cost  += c["input_cost_usd"]
            total_output_cost += c["output_cost_usd"]

        last = doc.get("last_used")
        results.append({
            "user_email":      doc["_id"]["user_email"],
            "user_persona":    doc["_id"]["user_persona"],
            "total_tokens":    doc["total_tokens"],
            "request_count":   doc["request_count"],
            "models_used":     len(doc["models_used"]),
            "input_cost_usd":  round(total_input_cost, 6),
            "output_cost_usd": round(total_output_cost, 6),
            "total_cost_usd":  round(total_input_cost + total_output_cost, 6),
            "last_used":       last.isoformat() if isinstance(last, datetime) else str(last or ""),
        })
    return results


# ─── Timeline chart from usage_daily ─────────────────────────────────────────
@router.get("/timeline")
async def usage_timeline(
    days: int = Query(30),
    user_email: Optional[str] = Query(None),
    model_id: Optional[str] = Query(None),
):
    pricing = await _get_pricing_map()
    usage_daily = _db.get_collection("usage_daily")
    cutoff = (datetime.now(timezone.utc) - timedelta(days=days)).strftime("%Y-%m-%d")
    query: dict = {"date": {"$gte": cutoff}}
    if user_email:
        query["user_email"] = user_email
    if model_id:
        query["model_db_id"] = model_id

    pipeline = [
        {"$match": query},
        {"$group": {
            "_id": "$date",
            "rows": {"$push": {
                "model_db_id":       "$model_db_id",
                "prompt_tokens":     "$prompt_tokens",
                "completion_tokens": "$completion_tokens",
            }},
            "total_tokens":  {"$sum": "$total_tokens"},
            "request_count": {"$sum": "$request_count"},
        }},
        {"$sort": {"_id": 1}},
    ]

    results = []
    async for doc in usage_daily.aggregate(pipeline):
        input_cost = output_cost = 0.0
        for row in doc["rows"]:
            c = _calc_cost(row["prompt_tokens"], row["completion_tokens"], pricing, row["model_db_id"])
            input_cost  += c["input_cost_usd"]
            output_cost += c["output_cost_usd"]
        results.append({
            "date":            doc["_id"],
            "total_tokens":    doc["total_tokens"],
            "request_count":   doc["request_count"],
            "input_cost_usd":  round(input_cost, 6),
            "output_cost_usd": round(output_cost, 6),
            "total_cost_usd":  round(input_cost + output_cost, 6),
        })
    return results


# ─── Overall KPI totals ───────────────────────────────────────────────────────
@router.get("/totals")
async def usage_totals(days: int = Query(30)):
    pricing = await _get_pricing_map()

    pipeline = [
        {"$match": {"last_used": {"$gte": _since(days)}}},
        {"$group": {
            "_id": None,
            "rows": {"$push": {
                "model_db_id":       "$model_db_id",
                "prompt_tokens":     "$prompt_tokens",
                "completion_tokens": "$completion_tokens",
            }},
            "total_tokens":   {"$sum": "$total_tokens"},
            "total_requests": {"$sum": "$request_count"},
            "unique_users":   {"$addToSet": "$user_email"},
            "unique_models":  {"$addToSet": "$model_db_id"},
        }},
    ]

    async for doc in usage_collection.aggregate(pipeline):
        input_cost = output_cost = 0.0
        for row in doc["rows"]:
            c = _calc_cost(row["prompt_tokens"], row["completion_tokens"], pricing, row["model_db_id"])
            input_cost  += c["input_cost_usd"]
            output_cost += c["output_cost_usd"]
        return {
            "total_tokens":          doc["total_tokens"],
            "total_requests":        doc["total_requests"],
            "unique_users":          len(doc["unique_users"]),
            "unique_models":         len(doc["unique_models"]),
            "total_input_cost_usd":  round(input_cost, 6),
            "total_output_cost_usd": round(output_cost, 6),
            "total_cost_usd":        round(input_cost + output_cost, 6),
        }

    return {
        "total_tokens": 0, "total_requests": 0,
        "unique_users": 0, "unique_models": 0,
        "total_input_cost_usd": 0, "total_output_cost_usd": 0, "total_cost_usd": 0,
    }


# ─── By Provider ──────────────────────────────────────────────────────────────
@router.get("/by-provider")
async def usage_by_provider(days: int = Query(30)):
    pricing = await _get_pricing_map()

    pipeline = [
        {"$match": {"last_used": {"$gte": _since(days)}}},
        {"$group": {
            "_id": "$provider",
            "prompt_tokens":     {"$sum": "$prompt_tokens"},
            "completion_tokens": {"$sum": "$completion_tokens"},
            "total_tokens":      {"$sum": "$total_tokens"},
            "request_count":     {"$sum": "$request_count"},
            "unique_users":      {"$addToSet": "$user_email"},
            "unique_models":     {"$addToSet": "$model_name"},
            "rows": {"$push": {
                "model_db_id":       "$model_db_id",
                "prompt_tokens":     "$prompt_tokens",
                "completion_tokens": "$completion_tokens",
            }},
        }},
        {"$sort": {"total_tokens": -1}},
    ]

    results = []
    async for doc in usage_collection.aggregate(pipeline):
        total_input_cost = total_output_cost = 0.0
        for row in doc["rows"]:
            c = _calc_cost(row["prompt_tokens"], row["completion_tokens"], pricing, row["model_db_id"])
            total_input_cost  += c["input_cost_usd"]
            total_output_cost += c["output_cost_usd"]
        results.append({
            "provider":          doc["_id"] or "unknown",
            "prompt_tokens":     doc["prompt_tokens"],
            "completion_tokens": doc["completion_tokens"],
            "total_tokens":      doc["total_tokens"],
            "request_count":     doc["request_count"],
            "unique_users":      len(doc["unique_users"]),
            "unique_models":     len(doc["unique_models"]),
            "input_cost_usd":    round(total_input_cost, 6),
            "output_cost_usd":   round(total_output_cost, 6),
            "total_cost_usd":    round(total_input_cost + total_output_cost, 6),
        })
    return results


# ─── By Department ────────────────────────────────────────────────────────────
@router.get("/by-department")
async def usage_by_department(days: int = Query(30)):
    pricing = await _get_pricing_map()

    pipeline = [
        {"$match": {"last_used": {"$gte": _since(days)}}},
        {"$lookup": {
            "from": "users",
            "localField": "user_email",
            "foreignField": "email",
            "as": "user_doc"
        }},
        {"$unwind": {"path": "$user_doc", "preserveNullAndEmptyArrays": True}},
        {"$group": {
            "_id": {"$ifNull": ["$user_doc.department", {"$ifNull": ["$user_department", "Unassigned"]}]},
            "rows": {"$push": {
                "model_db_id":       "$model_db_id",
                "prompt_tokens":     "$prompt_tokens",
                "completion_tokens": "$completion_tokens",
            }},
            "total_tokens":  {"$sum": "$total_tokens"},
            "request_count": {"$sum": "$request_count"},
            "unique_users":  {"$addToSet": "$user_email"},
            "unique_models": {"$addToSet": "$model_name"},
            "last_used":     {"$max": "$last_used"},
        }},
        {"$sort": {"total_tokens": -1}},
    ]

    results = []
    async for doc in usage_collection.aggregate(pipeline):
        total_input_cost = total_output_cost = 0.0
        for row in doc["rows"]:
            c = _calc_cost(row["prompt_tokens"], row["completion_tokens"], pricing, row["model_db_id"])
            total_input_cost  += c["input_cost_usd"]
            total_output_cost += c["output_cost_usd"]

        last = doc.get("last_used")
        results.append({
            "department":      doc["_id"] or "Unassigned",
            "total_tokens":    doc["total_tokens"],
            "request_count":   doc["request_count"],
            "unique_users":    len(doc["unique_users"]),
            "unique_models":   len(doc["unique_models"]),
            "input_cost_usd":  round(total_input_cost, 6),
            "output_cost_usd": round(total_output_cost, 6),
            "total_cost_usd":  round(total_input_cost + total_output_cost, 6),
            "last_used":       last.isoformat() if isinstance(last, datetime) else str(last or ""),
        })
    return results

