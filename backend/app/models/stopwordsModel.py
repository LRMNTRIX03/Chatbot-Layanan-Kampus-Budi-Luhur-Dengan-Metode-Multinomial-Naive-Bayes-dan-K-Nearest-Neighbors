from app.extensions import db
from datetime import datetime

class StopwordsModel(db.Model):
    __tablename__ = "stopwords"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    text = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "text": self.text,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }