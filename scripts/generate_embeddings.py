import json
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# configure gemini
GENAI_API_KEY = os.getenv("GENAI_API_KEY")
MODEL = os.getenv("MODEL")

genai.configure(GENAI_API_KEY)

def generate_embedding(text):
    response = genai.embed_content(
        model=MODEL,
        content=text
    )
    return response["embedding"]


def dict_to_text(d):
    """Convert specifications dictionary to readable text."""
    return ". ".join([f"{key}: {value}" for key, value in d.items()])


def process_file(category):
    input_file = f"./data/{category}.json"
    output_file = f"./embeddings/{category}_embeddings.json"

    os.makedirs("./embeddings", exist_ok=True)

    with open(input_file, "r", encoding="utf-8") as f:
        products = json.load(f)

    output = []

    for p in products:

        specs_text = dict_to_text(p.get("specifications", {}))
        reviews_text = ". ".join(p.get("reviews", []))
        tags_text = ", ".join(p.get("tags", []))

        merged_text = (
            f"{p.get('name', '')}. "
            f"Brand: {p.get('brand', '')}. "
            f"Category: {p.get('category', '')}. "
            f"Description: {p.get('description', '')}. "
            f"Specifications: {specs_text}. "
            f"Reviews: {reviews_text}. "
            f"Tags: {tags_text}."
        )

        vector = generate_embedding(merged_text)

        output.append({
            "id": p.get("_id"),
            "category": category,
            "text": merged_text,
            "embedding": vector
        })

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=4)

    print(f"Saved -> {output_file}")


# list all your categories
categories = [
    "phones", "laptops", "refrigerators", "televisions",
    "washing_machines", "air_conditioners", "chimneys",
    "water_purifiers", "fans", "inverters", "water_heaters"
]

for cat in categories:
    process_file(cat)
