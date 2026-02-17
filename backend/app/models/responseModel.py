from app.extensions import db
from datetime import datetime

class ResponseModel(db.Model):
    __tablename__ = "responses"

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    intent_id = db.Column(db.Integer, db.ForeignKey("intents.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    


    def __repr__(self):
        return f"<Response {self.text[:30]}>"
    
    def to_dict(self):
        return {
            "id": self.id,
            "text": self.text.title(),
            "intent_name": self.intent_to_response.name,
            "intent_id": self.intent_id,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
