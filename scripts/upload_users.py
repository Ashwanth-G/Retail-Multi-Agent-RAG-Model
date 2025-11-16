from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Read connection string from .env
MONGO_URI = os.getenv("MONGO_URI")

# Connect to MongoDB Atlas
client = MongoClient(MONGO_URI)

# Database and collection
db = client["Retail_DB"]
users = db["users"]

# ---------- MINIMAL TEST USER ----------
user_doc = {
    "_id": "usr001",
    "username": "ashwanth",
    "preferences": {},
    "search_history": [],
    "purchase_history": []
}

# ---------- INSERT ----------
try:
    users.insert_one(user_doc)
    print("✅ Minimal user inserted successfully!")
except Exception as e:
    print("❌ Error inserting user:", e)
