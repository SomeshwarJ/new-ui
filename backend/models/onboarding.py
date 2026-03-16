from pydantic import BaseModel, Field
from typing import List, Optional, Any

class HyperparamSchema(BaseModel):
    id: Any
    label: str
    type: str
    min: Optional[str] = ""
    max: Optional[str] = ""
    default: Optional[str] = ""
    optional: bool = False

class ModelOnboardingSchema(BaseModel):
    name: str = Field(...)
    modelId: str = Field(...)
    provider: str = Field(...)
    description: Optional[str] = ""
    modelLink: str = Field(...)
    type: str = Field(...)
    propertyKey: Optional[str] = ""
    maxTokens: Optional[str] = ""
    retirementDate: Optional[str] = ""
    inputPricing: Optional[str] = ""
    outputPricing: Optional[str] = ""
    togglePlayground: bool = True
    toggleBYA: bool = False
    toggleAPI: bool = True
    selectedFormats: List[str] = []
    hyperparams: List[HyperparamSchema] = []
    payload: Optional[str] = ""
    
    # Platform management defaults
    status: str = "pending"
    vendor: str = "—"
    version: str = "v1.0"
    contextWindow: str = "—"
    costPer1M: str = "—"
    latency: str = "—"
    usage: str = "—"
    tags: List[str] = []
    note: Optional[str] = None

class ModelUpdateSchema(BaseModel):
    status: Optional[str] = None
    note: Optional[str] = None
    name: Optional[str] = None
    modelId: Optional[str] = None
    provider: Optional[str] = None
    description: Optional[str] = None
    modelLink: Optional[str] = None
    type: Optional[str] = None
    propertyKey: Optional[str] = None
    maxTokens: Optional[str] = None
    retirementDate: Optional[str] = None
    inputPricing: Optional[str] = None
    outputPricing: Optional[str] = None
    togglePlayground: Optional[bool] = None
    toggleBYA: Optional[bool] = None
    toggleAPI: Optional[bool] = None
    selectedFormats: Optional[List[str]] = None
    hyperparams: Optional[List[HyperparamSchema]] = None
    payload: Optional[str] = None
