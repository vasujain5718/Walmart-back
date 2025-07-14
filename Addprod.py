from pymongo import MongoClient
from datetime import datetime
import random
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get MongoDB URI from environment variable
uri = os.getenv('MONGO_URI')

# Connect to MongoDB
client = MongoClient(uri)
db = client['walmart']
products_collection = db['products']  # Matches your Mongoose model

products_collection.delete_many({})

# Mapping of product names to categories
product_category_map = {
    'Widget': 'Electronics',
    'Gadget': 'Electronics',
    'T-Shirt': 'Clothing',
    'Shirt': 'Clothing',
    'Mixer': 'Home',
    'Vacuum': 'Home',
    'Toy Car': 'Toys',
    'Board Game': 'Toys',
    'Apple': 'Groceries',
    'Headphones': 'Electronics'
}

product_names = list(product_category_map.keys())

products = []
for i in range(50):  # Add 50 dummy products
    base_name = random.choice(product_names)
    product = {
        "name": f"{base_name} {i+1}",
        "category": product_category_map[base_name],
        "price": round(random.uniform(100, 1000), 2),
        "stock": random.randint(10, 100),
        "createdAt": datetime.utcnow()
    }
    products.append(product)

# Insert into MongoDB
result = products_collection.insert_many(products)
print(f"✅ Inserted {len(result.inserted_ids)} products into MongoDB.")
