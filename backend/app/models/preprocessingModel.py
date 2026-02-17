from app.extensions import db
from datetime import datetime

class PreprocessingModel(db.Model):
    __tablename__ = "preprocessing"
    id = db.Column(db.Integer, primary_key=True)
    pattern_id = db.Column(db.Integer, db.ForeignKey("patterns.id"), nullable=False)
    case_folding_text = db.Column(db.Text, nullable=True, default=None)
    clean_text_result = db.Column(db.Text, nullable=True, default=None)
    slangwords_result = db.Column(db.Text, nullable=True, default=None)
    tokenization_text = db.Column(db.Text, nullable=True, default=None)
    stopword_removal_text = db.Column(db.Text, nullable=True, default=None)
    stemming_text = db.Column(db.Text, nullable=True, default=None)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    preprocessed_text = db.Column(db.Text, nullable=True, default=None)
    
    pre_relations = db.relationship("PatternModel", backref="preprocessing_to_pattern", lazy=True)
    
    def to_dict(self):
        return {
            "id": self.id,
            "pattern_id": self.pattern_id,
            "case_folding_text": self.case_folding_text,
            "clean_text_result": self.clean_text_result,
            "stopword_removal_text": self.stopword_removal_text,
            "stemming_text": self.stemming_text,
            "slangwords_result": self.slangwords_result,
            "tokenization_text": self.tokenization_text,
            "preprocessed_text": self.preprocessed_text,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
    
    def __repr__(self):
        return f"<PreprocessingModel id={self.id}>"