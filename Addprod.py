from pymongo import MongoClient
from datetime import datetime
import random

# MongoDB Atlas URI
uri = "mongodb+srv://vasujain:vasu%405718@inotebook.ohl0fel.mongodb.net/walmart?retryWrites=true&w=majority&appName=inotebook"

# Connect to MongoDB
client = MongoClient(uri)
db = client['walmart']
products_collection = db['products']  # Matches your Mongoose model

# Sample product data
categories = ['Electronics', 'Groceries', 'Clothing', 'Home', 'Toys']
product_names = ['Widget', 'Gadget', 'T-Shirt', 'Mixer', 'Toy Car', 'Headphones', 'Apple', 'Shirt', 'Vacuum', 'Board Game']

products = []
for i in range(50):  # Add 50 dummy products
    product = {
        "name": f"{random.choice(product_names)} {i+1}",
        "category": random.choice(categories),
        "price": round(random.uniform(100, 1000), 2),
        "stock": random.randint(10, 100),
        "createdAt": datetime.utcnow()
    }
    products.append(product)

# Insert into MongoDB
result = products_collection.insert_many(products)
print(f"✅ Inserted {len(result.inserted_ids)} products into MongoDB.")
