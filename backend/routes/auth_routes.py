from fastapi import APIRouter, Body, HTTPException, status
from pydantic import EmailStr
from models.user import UserSchema, UserLoginSchema
from core.database import user_collection
from core.security import verify_password, get_password_hash, create_access_token
from datetime import timedelta

router = APIRouter()

@router.post("/register", response_description="Add new user")
async def register(user: UserSchema = Body(...)):
    existing_user = await user_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if user.persona not in ["creator", "consumer", "platform admin"]:
        raise HTTPException(status_code=400, detail="Invalid persona")

    user_dict = user.model_dump()
    user_dict["password"] = get_password_hash(user.password)
    
    new_user = await user_collection.insert_one(user_dict)
    return {"message": "User created successfully"}

@router.post("/login", response_description="Login user")
async def login(user: UserLoginSchema = Body(...)):
    existing_user = await user_collection.find_one({"email": user.email})
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if not verify_password(user.password, existing_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={
            "sub": existing_user["email"],
            "persona": existing_user["persona"],
            "department": existing_user.get("department", ""),
        },
        expires_delta=access_token_expires
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "persona": existing_user["persona"],
        "fullname": existing_user.get("fullname", "User"),
        "email": existing_user["email"],
        "department": existing_user.get("department", "")
    }
