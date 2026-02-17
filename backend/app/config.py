import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = os.environ.get("DB_URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_TYPE="filesystem"
    SESSION_PERMANENT = False
    SESSION_COOKIE_HTTPONLY = True
    PERMANENT_SESSION_LIFETIME = 60 * 60 * 24 * 1 
    REMEMBER_COOKIE_DURATION = 60 * 60 * 24 * 1    
    SESSION_COOKIE_SAMESITE = "lax"
    SESSION_COOKIE_SECURE = False  


    