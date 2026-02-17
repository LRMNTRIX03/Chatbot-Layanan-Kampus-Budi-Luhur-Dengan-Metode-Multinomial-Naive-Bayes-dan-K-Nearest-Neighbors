from app.extensions import db

class IntentModel(db.Model):
    __tablename__ = "intents"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(
        db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp()
    )

    patterns = db.relationship("PatternModel", backref="intent_to_pattern", lazy=True)
    responses = db.relationship("ResponseModel", backref="intent_to_response", lazy=True)

    def __repr__(self):
        return f"<Intent {self.name}>"
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
