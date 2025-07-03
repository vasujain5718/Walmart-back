import random
from datetime import datetime, timedelta
from pymongo import MongoClient
from bson.objectid import ObjectId

# Connect to local MongoDB
client = MongoClient('mongodb+srv://vasujain:vasu%405718@inotebook.ohl0fel.mongodb.net/walmart?retryWrites=true&w=majority&appName=inotebook')
db = client['walmart']
products_collection = db['products']
sales_collection = db['sales']

# Fetch existing products
products = list(products_collection.find())

if not products:
    print("No products found. Add some products first.")
    exit()

# Config
start_date = datetime.now() - timedelta(days=180)  # 6 months ago
end_date = datetime.now()
total_sales_to_generate = 1000

def random_date(start, end):
    return start + timedelta(seconds=random.randint(0, int((end - start).total_seconds())))

# Generate sales
dummy_sales = []

for _ in range(total_sales_to_generate):
    product = random.choice(products)
    sale = {
        "productId": product["_id"],
        "productName": product["name"],
        "price": product["price"],
        "quantity": random.randint(1, 5),
        "date": random_date(start_date, end_date)
    }
    dummy_sales.append(sale)

# Insert sales
sales_collection.insert_many(dummy_sales)

print(f"Inserted {len(dummy_sales)} dummy sales records.")
