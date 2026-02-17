from app.extensions import db
from datetime import datetime
from flask_login import UserMixin


class UserModel(db.Model, UserMixin):
    
    __tablename__ = "users"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(250), unique=True, nullable=False)
    name = db.Column(db.String(250), nullable=False, default="userexample")
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(50), nullable=False, default="user")
    is_active = db.Column(db.Boolean, default=True, nullable=False) 
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {"id": self.id, 
                "username": self.username, 
                "role": self.role,
                "name": self.name,}