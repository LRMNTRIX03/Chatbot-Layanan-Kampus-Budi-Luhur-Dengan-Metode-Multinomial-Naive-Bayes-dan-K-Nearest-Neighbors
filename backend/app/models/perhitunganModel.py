from app.extensions import db
from datetime import datetime

class PerhitunganModel(db.Model):
    __tablename__ = 'perhitungan'
    perhitungan_id = db.Column(db.Integer, primary_key=True)
    rasio = db.Column(db.String(50), nullable=True)
    model = db.Column(db.String(50), nullable=True)
    k_val = db.Column(db.String(10), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'perhitungan_id': self.perhitungan_id,
            'rasio': self.rasio,
            'model': self.model,
            "k_val": self.k_val,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }