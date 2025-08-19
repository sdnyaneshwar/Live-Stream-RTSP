from pymongo import MongoClient
from config import Config

client = MongoClient(Config.MONGODB_URI)
db = client.get_database()
print("Connected to MongoDB:", db.name)
client.close()