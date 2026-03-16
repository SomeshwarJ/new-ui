from motor.motor_asyncio import AsyncIOMotorClient

MONGO_DETAILS = "mongodb+srv://som:Someshwar%402002@cluster0.qzq0wzu.mongodb.net/"

client = AsyncIOMotorClient(MONGO_DETAILS)
db = client.genai_studio

user_collection = db.get_collection("users")
usage_collection = db.get_collection("usage_records")
usage_daily_collection = db.get_collection("usage_daily")
