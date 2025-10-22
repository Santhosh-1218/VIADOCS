from flask_pymongo import PyMongo
from flask import Flask
from dotenv import load_dotenv
import os

load_dotenv()
mongo = PyMongo()

def init_db(app: Flask):
    app.config["MONGO_URI"] = os.getenv("MONGO_URI")
    mongo.init_app(app)
