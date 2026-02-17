from app.extensions import db
from datetime import datetime
class PatternModel(db.Model):
    __tablename__ = "patterns"

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(255), nullable=False)
    intent_id = db.Column(db.Integer, db.ForeignKey("intents.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )   
    
    # __table_args__ = (
    #     db.UniqueConstraint("intent_id", name="unique_text_intent"),
    # )
 
    
    
    

    def __repr__(self):
        return f"<Pattern {self.text[:30]}>"
    
    def to_dict(self):
        return {
            "id": self.id,
            "text": self.text,
            "intent_id": self.intent_id,
            "intent_name" : self.intent_to_pattern.name,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }