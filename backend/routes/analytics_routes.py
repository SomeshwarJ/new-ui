from fastapi import APIRouter, Query, Body, Request
from fastapi.responses import StreamingResponse
from core.database import db
from datetime import datetime, timezone, timedelta
from typing import Optional
import io, csv, json

router = APIRouter()
prompt_logs_col = db.get_collection("prompt_logs")


# ─── Helper ───────────────────────────────────────────────────────────────────
def _since(days: int) -> datetime:
    return datetime.now(timezone.utc) - timedelta(days=days)


def _serialize(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    if isinstance(doc.get("timestamp"), datetime):
        doc["timestamp"] = doc["timestamp"].isoformat()
    return doc


# ─── POST a new prompt log (called by playground) ────────────────────────────
@router.post("/log", response_description="Record a prompt/response log")
async def create_prompt_log(log: dict = Body(...)):
    log["timestamp"] = datetime.now(timezone.utc)
    result = await prompt_logs_col.insert_one(log)
    return {"id": str(result.inserted_id)}


# ─── GET all logs with filtering ─────────────────────────────────────────────
@router.get("/logs", response_description="List prompt logs with filters")
async def get_logs(
    days:          int            = Query(7),
    model:         Optional[str]  = Query(None),
    user_email:    Optional[str]  = Query(None),
    has_error:     Optional[bool] = Query(None),
    limit:         int            = Query(200),
    skip:          int            = Query(0),
):
    cutoff = _since(days)
    query: dict = {"timestamp": {"$gte": cutoff}}
    if model:
        query["model_name"] = {"$regex": model, "$options": "i"}
    if user_email:
        query["user_email"] = user_email
    if has_error is True:
        query["error"] = {"$exists": True, "$ne": None}

    docs = []
    cursor = prompt_logs_col.find(query).sort("timestamp", -1).skip(skip).limit(limit)
    async for doc in cursor:
        docs.append(_serialize(doc))
    return docs


# ─── GET trends: daily token + cost + latency aggregates ─────────────────────
@router.get("/trends", response_description="Daily usage trends")
async def analytics_trends(
    days:  int           = Query(30),
    model: Optional[str] = Query(None),
):
    cutoff = _since(days)
    match: dict = {"timestamp": {"$gte": cutoff}}
    if model:
        match["model_name"] = {"$regex": model, "$options": "i"}

    pipeline = [
        {"$match": match},
        {"$group": {
            "_id":                {"$dateToString": {"format": "%Y-%m-%d", "date": "$timestamp"}},
            "requests":           {"$sum": 1},
            "tokens_in":          {"$sum": "$tokens_in"},
            "tokens_out":         {"$sum": "$tokens_out"},
            "total_tokens":       {"$sum": {"$add": ["$tokens_in", "$tokens_out"]}},
            "avg_latency_ms":     {"$avg": "$latency_ms"},
            "total_cost":         {"$sum": "$cost_usd"},
            "errors":             {"$sum": {"$cond": [{"$ifNull": ["$error", False]}, 1, 0]}},
        }},
        {"$sort": {"_id": 1}},
    ]

    results = []
    async for doc in prompt_logs_col.aggregate(pipeline):
        results.append({
            "date":           doc["_id"],
            "requests":       doc["requests"],
            "tokens_in":      doc["tokens_in"],
            "tokens_out":     doc["tokens_out"],
            "total_tokens":   doc["total_tokens"],
            "avg_latency_ms": round(doc["avg_latency_ms"] or 0, 1),
            "total_cost":     round(doc["total_cost"] or 0, 6),
            "errors":         doc["errors"],
        })
    return results


# ─── GET outliers: extreme token usage / latency ──────────────────────────────
@router.get("/outliers", response_description="Outlier prompt logs")
async def analytics_outliers(
    days:              int   = Query(30),
    latency_threshold: float = Query(5000, description="ms above which is an outlier"),
    tokens_threshold:  int   = Query(2000,  description="total tokens above which is an outlier"),
):
    cutoff = _since(days)
    query = {
        "timestamp": {"$gte": cutoff},
        "$or": [
            {"latency_ms":   {"$gt": latency_threshold}},
            {"$expr": {"$gt": [{"$add": ["$tokens_in", "$tokens_out"]}, tokens_threshold]}},
            {"error": {"$exists": True, "$ne": None}},
        ]
    }

    docs = []
    cursor = prompt_logs_col.find(query).sort("latency_ms", -1).limit(100)
    async for doc in cursor:
        docs.append(_serialize(doc))
    return docs


# ─── GET model comparison summary ─────────────────────────────────────────────
@router.get("/by-model", response_description="Per-model analytics summary")
async def analytics_by_model(days: int = Query(30)):
    cutoff = _since(days)
    pipeline = [
        {"$match": {"timestamp": {"$gte": cutoff}}},
        {"$group": {
            "_id":            "$model_name",
            "provider":       {"$first": "$provider"},
            "requests":       {"$sum": 1},
            "tokens_in":      {"$sum": "$tokens_in"},
            "tokens_out":     {"$sum": "$tokens_out"},
            "avg_latency_ms": {"$avg": "$latency_ms"},
            "total_cost":     {"$sum": "$cost_usd"},
            "errors":         {"$sum": {"$cond": [{"$ifNull": ["$error", False]}, 1, 0]}},
        }},
        {"$sort": {"requests": -1}},
    ]

    results = []
    async for doc in prompt_logs_col.aggregate(pipeline):
        results.append({
            "model_name":     doc["_id"],
            "provider":       doc.get("provider", ""),
            "requests":       doc["requests"],
            "tokens_in":      doc["tokens_in"],
            "tokens_out":     doc["tokens_out"],
            "avg_latency_ms": round(doc["avg_latency_ms"] or 0, 1),
            "total_cost":     round(doc["total_cost"] or 0, 6),
            "errors":         doc["errors"],
        })
    return results



# ─── Export: CSV or JSON ──────────────────────────────────────────────────────
@router.get("/export", response_description="Export logs as CSV or JSON")
async def analytics_export(
    format: str          = Query("csv", regex="^(csv|json)$"),
    days:   int          = Query(7),
    model:  Optional[str] = Query(None),
):
    cutoff = _since(days)
    query: dict = {"timestamp": {"$gte": cutoff}}
    if model:
        query["model_name"] = {"$regex": model, "$options": "i"}

    docs = []
    async for doc in prompt_logs_col.find(query).sort("timestamp", -1).limit(5000):
        docs.append(_serialize(doc))

    if format == "json":
        content = json.dumps(docs, indent=2)
        return StreamingResponse(
            io.BytesIO(content.encode()),
            media_type="application/json",
            headers={"Content-Disposition": "attachment; filename=prompt_logs.json"},
        )

    # CSV
    fields = ["timestamp", "model_name", "provider", "user_email", "tokens_in", "tokens_out",
              "latency_ms", "cost_usd", "error"]
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=fields, extrasaction="ignore")
    writer.writeheader()
    for doc in docs:
        writer.writerow(doc)
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=prompt_logs.csv"},
    )
