from fastapi import APIRouter, Body, HTTPException, status
from models.onboarding import ModelOnboardingSchema, ModelUpdateSchema
from core.database import db
from bson import ObjectId
from typing import List

router = APIRouter()
model_collection = db.get_collection("models")

def model_helper(model) -> dict:
    return {
        "id": str(model["_id"]),
        "name": model.get("name"),
        "modelId": model.get("modelId"),
        "provider": model.get("provider"),
        "description": model.get("description"),
        "modelLink": model.get("modelLink"),
        "type": model.get("type"),
        "propertyKey": model.get("propertyKey"),
        "maxTokens": model.get("maxTokens"),
        "retirementDate": model.get("retirementDate"),
        "inputPricing": model.get("inputPricing"),
        "outputPricing": model.get("outputPricing"),
        "togglePlayground": model.get("togglePlayground"),
        "toggleBYA": model.get("toggleBYA"),
        "toggleAPI": model.get("toggleAPI"),
        "selectedFormats": model.get("selectedFormats"),
        "hyperparams": model.get("hyperparams"),
        "payload": model.get("payload"),
        "status": model.get("status"),
        "vendor": model.get("vendor"),
        "version": model.get("version"),
        "contextWindow": model.get("contextWindow"),
        "costPer1M": model.get("costPer1M"),
        "latency": model.get("latency"),
        "usage": model.get("usage"),
        "tags": model.get("tags"),
        "note": model.get("note")
    }

@router.post("/", response_description="Onboard a new model")
async def onboard_model(model: ModelOnboardingSchema = Body(...)):
    model_dict = model.model_dump()
    new_model = await model_collection.insert_one(model_dict)
    created_model = await model_collection.find_one({"_id": new_model.inserted_id})
    return model_helper(created_model)

@router.get("/", response_description="Get all models")
async def get_models():
    models = []
    async for model in model_collection.find():
        models.append(model_helper(model))
    return models

@router.get("/{id}", response_description="Get model by ID")
async def get_model(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    model = await model_collection.find_one({"_id": ObjectId(id)})
    if model:
        return model_helper(model)
    raise HTTPException(status_code=404, detail="Model not found")

@router.put("/{id}", response_description="Update a model")
async def update_model(id: str, model_data: ModelUpdateSchema = Body(...)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    
    update_data = {k: v for k, v in model_data.model_dump().items() if v is not None}
    
    if len(update_data) >= 1:
        update_result = await model_collection.update_one({"_id": ObjectId(id)}, {"$set": update_data})
        if update_result.modified_count == 1:
            updated_model = await model_collection.find_one({"_id": ObjectId(id)})
            return model_helper(updated_model)
            
    existing_model = await model_collection.find_one({"_id": ObjectId(id)})
    if existing_model:
        return model_helper(existing_model)
    
    raise HTTPException(status_code=404, detail="Model not found")

@router.patch("/{id}", response_description="Update model status")
async def patch_model_status(id: str, status_data: dict = Body(...)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    
    update_result = await model_collection.update_one(
        {"_id": ObjectId(id)}, 
        {"$set": {"status": status_data.get("status"), "note": status_data.get("note")}}
    )
    
    if update_result.modified_count == 1:
        updated_model = await model_collection.find_one({"_id": ObjectId(id)})
        return model_helper(updated_model)
        
    raise HTTPException(status_code=404, detail="Model not found or status already matches")

@router.delete("/{id}", response_description="Delete a model")
async def delete_model(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    delete_result = await model_collection.delete_one({"_id": ObjectId(id)})
    if delete_result.deleted_count == 1:
        return {"message": "Model deleted successfully"}
    raise HTTPException(status_code=404, detail="Model not found")
