import os
import json
from pymongo import MongoClient
from dotenv import load_dotenv

ENV_PATH = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(ENV_PATH)

# ---- CONFIG ----
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")
EMBEDDINGS_COLLECTION = os.getenv("EMBEDDINGS_COLLECTION")
EMB_FOLDER = os.path.join(os.path.dirname(__file__), "..", "embeddings")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
emb_col = db[EMBEDDINGS_COLLECTION]


def upload_all_embeddings():
    """
    Reads every JSON file in ./embeddings and uploads full product data to MongoDB Atlas.
    """
    if not os.path.exists(EMB_FOLDER):
        raise FileNotFoundError(f"Embeddings folder not found: {EMB_FOLDER}")

    files = [f for f in os.listdir(EMB_FOLDER) if f.endswith(".json")]

    print(f"Found {len(files)} embedding files.")

    for fname in files:
        filepath = os.path.join(EMB_FOLDER, fname)

        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Your files contain arrays, so enforce list check
        if isinstance(data, list):
            for item in data:
                product_id = item.get("id") or item.get("product_id")
                embedding = item.get("embedding")

                # NEW fields
                title = item.get("title")
                category = item.get("category")
                description = item.get("description")

                if not product_id or embedding is None:
                    print(f"❌ Missing required fields in {fname}")
                    continue

                # ---- FIXED: upload everything ----
                update_doc = {
                    "product_id": product_id,
                    "embedding": embedding,
                    "title": title,
                    "category": category,
                    "description": description,
                }

                emb_col.update_one(
                    {"product_id": product_id},
                    {"$set": update_doc},
                    upsert=True
                )

                print(f"✅ Uploaded: {product_id}")

        else:
            print(f"❌ Expected list in {fname}, found object. Skipping.")


if __name__ == "__main__":
    upload_all_embeddings()
