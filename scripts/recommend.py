"""
Hybrid Recommendation Script
- Loads embeddings from ./embeddings/*.json (pre-generated with Gemini)
- Loads product raw data from ./data/*.json
- Reads user profile from MongoDB (db: recommendation_db, col: users)
- Embeds user query with Gemini and does cosine-similarity retrieval
- Applies numeric filters (price, rating, stock) from user preferences
- Applies boosts for preferred_brands and preferred categories
- Returns top-k ranked product suggestions

Usage examples:
    python recommend.py --user_id usr001 --query "best 5g phone under 12000 with strong battery" --k 10
    python recommend.py --query "budget washing machine" --k 5
"""

import os
import json
import argparse
import numpy as np
from pymongo import MongoClient
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# ---------- CONFIG ----------
GENAI_API_KEY = os.getenv("GENAI_API_KEY")
MODEL = os.getenv("MODEL")
MONGO_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME")
USERS_COL = os.getenv("USERS_COL")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
EMBEDDINGS_FOLDER = os.path.join(BASE_DIR, "..", "embeddings")
DATA_FOLDER = os.path.join(BASE_DIR, "..", "data")

# Budget thresholds (INR) - adjust to your market
BUDGET_THRESHOLDS = {
    "low": 15000,     # <= 15k is low
    "mid": 40000,     # <= 40k is mid
    "high": float("inf")
}
# ----------------------------

# configure Gemini
genai.configure(api_key=GENAI_API_KEY)

def generate_embedding(text: str):
    """Call Gemini to embed a text (single string)."""
    resp = genai.embed_content(model=MODEL, content=text)
    return np.array(resp["embedding"], dtype=np.float32)

def load_all_embeddings(embeddings_folder=EMBEDDINGS_FOLDER):
    """
    Load all embeddings JSON files and combine into one list.
    Each file is expected to contain a list of objects with keys:
        id, category, text, embedding
    Returns: list of dicts: { 'id', 'category', 'text', 'embedding' (np.array) }
    """
    items = []
    for fname in os.listdir(embeddings_folder):
        if not fname.endswith(".json"):
            continue
        path = os.path.join(embeddings_folder, fname)
        with open(path, "r", encoding="utf-8") as f:
            arr = json.load(f)
        for obj in arr:
            emb = np.array(obj["embedding"], dtype=np.float32)
            items.append({
                "id": obj.get("id"),
                "category": obj.get("category"),
                "text": obj.get("text"),
                "embedding": emb
            })
    # convert to dense arrays for faster matrix ops
    return items

def load_products(data_folder=DATA_FOLDER):
    """
    Load raw product JSON files from /data and index by product _id.
    Assumes each data file is a JSON array of product objects and each product uses `_id` key.
    """
    prod_map = {}
    for fname in os.listdir(data_folder):
        if not fname.endswith(".json"):
            continue
        path = os.path.join(data_folder, fname)
        with open(path, "r", encoding="utf-8") as f:
            arr = json.load(f)
        for p in arr:
            # prefer _id if present else id
            pid = p.get("_id") or p.get("id")
            if pid:
                prod_map[pid] = p
    return prod_map

def cosine_sim_matrix(query_vec, matrix):
    """
    query_vec: (d,)
    matrix: (n, d)
    returns sim: (n,)
    """
    # guard: if matrix empty
    if matrix.shape[0] == 0:
        return np.array([])
    # normalize
    q = query_vec / np.linalg.norm(query_vec)
    m_norm = matrix / np.linalg.norm(matrix, axis=1, keepdims=True)
    sims = m_norm.dot(q)
    return sims

def get_user_profile(user_id, mongo_uri=MONGO_URI):
    client = MongoClient(mongo_uri)
    db = client[DB_NAME]
    users = db[USERS_COL]
    user = users.find_one({"_id": user_id})
    client.close()
    return user

def apply_numeric_filters(candidates, products_map, price_max=None, rating_min=None, in_stock_only=True):
    """
    candidates: list of dicts with 'id' and other keys
    products_map: mapping id -> product JSON
    Returns filtered list
    """
    out = []
    for c in candidates:
        pid = c["id"]
        p = products_map.get(pid)
        if p is None:
            continue
        price = p.get("price")
        rating = p.get("rating")
        stock = p.get("stock", 0)
        # price filter
        if price_max is not None:
            try:
                if price is None or float(price) > price_max:
                    continue
            except:
                pass
        # rating filter
        if rating_min is not None:
            try:
                if rating is None or float(rating) < rating_min:
                    continue
            except:
                pass
        # stock
        if in_stock_only and (stock is None or int(stock) <= 0):
            continue
        out.append(c)
    return out

def compute_hybrid_score(candidates, products_map, user_prefs,
                         semantic_weight=0.7,
                         brand_boost=0.12,
                         category_boost=0.08,
                         price_penalty=0.05):
    """
    candidates: list of dict with fields:
        id, sem_sim (float)  <-- sem_sim is cosine similarity result
    products_map: id -> product dict
    user_prefs: user profile preferences
    Returns list with 'score' field added, sorted desc by score.
    """
    pref_brands = set([b.lower() for b in (user_prefs.get("preferred_brands") or [])])
    pref_cats = set([c.lower() for c in (user_prefs.get("categories") or [])])
    budget = (user_prefs.get("budget") or "").lower()

    # map budget to numeric threshold
    budget_threshold = None
    if budget in BUDGET_THRESHOLDS:
        budget_threshold = BUDGET_THRESHOLDS[budget]

    scored = []
    for c in candidates:
        pid = c["id"]
        sem = float(c.get("sem_sim", 0.0))  # cosine sim in [-1,1], usually [0,1]
        p = products_map.get(pid, {})

        score = semantic_weight * sem

        # brand boost
        brand = str(p.get("brand") or "").lower()
        if brand and (brand in pref_brands):
            score += brand_boost

        # category boost
        cat = str(p.get("category") or "").lower()
        if cat and (cat in pref_cats):
            score += category_boost

        # price proximity penalty/boost: if budget is set, reward cheaper than budget
        if budget_threshold is not None:
            price = p.get("price")
            try:
                price = float(price)
                # cheaper than budget -> small boost; more expensive -> penalty
                if price <= budget_threshold:
                    # closer to budget gets slightly better, but cheap gets small extra
                    score += (budget_threshold - price) / (budget_threshold + 1) * (price_penalty)
                else:
                    # penalty proportional to how far above budget
                    over = min(price - budget_threshold, budget_threshold)
                    score -= (over / (budget_threshold + 1)) * (price_penalty)
            except:
                pass

        # rating influence: small boost for high ratings
        rating = p.get("rating")
        try:
            rating = float(rating)
            # normalize rating (assuming 5 is max)
            score += ((rating - 3.0) / 10.0)  # small increment/decrement
        except:
            pass

        scored.append({**c, "score": float(score), "product": p})

    # sort by score desc
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored

def semantic_retrieve_and_rank(query, user_profile=None, top_k=20):
    """
    Full pipeline:
     - embed query
     - retrieve top_k semantically similar items from embeddings
     - filter using user preferences (price/rating)
     - compute hybrid score that includes boosts for brand/category
     - return top results
    """
    # 1) embed query
    q_emb = generate_embedding(query)

    # 2) load embeddings (we could cache globally for speed if this is a server)
    all_emb_items = load_all_embeddings()
    ids = [it["id"] for it in all_emb_items]
    emb_matrix = np.vstack([it["embedding"] for it in all_emb_items]) if all_emb_items else np.zeros((0, q_emb.shape[0]))
    # 3) compute cosine sims
    sims = cosine_sim_matrix(q_emb, emb_matrix)  # (n,)
    # attach sims to items
    candidates = []
    for i, it in enumerate(all_emb_items):
        candidates.append({
            "id": it["id"],
            "category": it["category"],
            "text": it["text"],
            "sem_sim": float(sims[i])
        })
    # 4) take top raw by semantic similarity
    candidates.sort(key=lambda x: x["sem_sim"], reverse=True)
    candidates = candidates[: max(top_k * 3, top_k)]  # fetch a few extra for filtering/reshuffle

    # 5) apply numeric filters from user_profile preferences (if present)
    price_max = None
    rating_min = None
    if user_profile:
        prefs = user_profile.get("preferences", {})
        budget = (prefs.get("budget") or "").lower()
        if budget in BUDGET_THRESHOLDS:
            price_max = BUDGET_THRESHOLDS[budget]
        # optionally allow rating min if user cares
        # if they have "min_rating" stored, use it
        rating_min = prefs.get("min_rating")

    products_map = load_products()
    filtered = apply_numeric_filters(candidates, products_map, price_max=price_max, rating_min=rating_min, in_stock_only=True)

    # 6) compute hybrid score and rank
    if user_profile:
        prefs = user_profile.get("preferences", {})
    else:
        prefs = {}
    scored = compute_hybrid_score(filtered, products_map, prefs)

    # final top-k
    return scored[:top_k]


# ---------- CLI ----------
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--user_id", type=str, default=None, help="user id (usr001)")
    parser.add_argument("--query", type=str, required=True, help="user query")
    parser.add_argument("--k", type=int, default=10, help="number of results")
    parser.add_argument("--mongo_uri", type=str, default=MONGO_URI)
    args = parser.parse_args()

    user = None
    if args.user_id:
        user = get_user_profile(args.user_id, mongo_uri=args.mongo_uri)
        if user is None:
            print(f"[warning] user {args.user_id} not found in DB. Continuing without personalization.")

    results = semantic_retrieve_and_rank(args.query, user_profile=user, top_k=args.k)

    # pretty print results
    print(f"\nTop {len(results)} results for query: '{args.query}'\n")
    for i, r in enumerate(results, start=1):
        p = r["product"]
        print(f"{i}. {p.get('name', 'unknown')}  (id: {r['id']})")
        print(f"   Brand: {p.get('brand')}")
        print(f"   Category: {p.get('category')}")
        print(f"   Price: ₹{p.get('price')}")
        print(f"   Rating: ⭐ {p.get('rating')}")

        # Reviews
        reviews = p.get("reviews", [])
        if reviews:
            print("   Reviews:")
            for rv in reviews:
                print(f"      - {rv}")

        # Specifications
        specs = p.get("specifications", {})
        if specs:
            print("   Specifications:")
            for key, val in specs.items():
                print(f"      {key.capitalize()}: {val}")

        print(f"   Score: {r['score']:.4f} (semantic {r['sem_sim']:.4f})")
        print()


if __name__ == "__main__":
    main()
