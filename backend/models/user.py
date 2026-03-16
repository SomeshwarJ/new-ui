from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserSchema(BaseModel):
    fullname: str = Field(...)
    email: EmailStr = Field(...)
    password: str = Field(...)
    persona: str = Field(description="creator, consumer, or platform admin", default="consumer")
    department: str = Field(description="User's department", default="")

class UserLoginSchema(BaseModel):
    email: EmailStr = Field(...)
    password: str = Field(...)
