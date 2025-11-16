import os
import json
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME")
COLLECTION = os.getenv("COLLECTION")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FOLDER = os.path.join(BASE_DIR, "..", "data")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
col = db[COLLECTION]

def upload_all_products():
    for fname in os.listdir(DATA_FOLDER):
        if not fname.endswith(".json"):
            continue
        
        path = os.path.join(DATA_FOLDER, fname)
        with open(path, "r", encoding="utf-8") as f:
            products = json.load(f)

        for p in products:
            pid = p.get("_id") or p.get("id")
            if not pid:
                continue

            # Upsert (update or insert)
            col.update_one({"_id": pid}, {"$set": p}, upsert=True)

        print(f"Uploaded: {fname}")

    print("✔ All product files uploaded successfully.")

if __name__ == "__main__":
    upload_all_products()
