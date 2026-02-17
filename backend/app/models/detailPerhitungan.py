from app.extensions import db
from datetime import datetime
import ast

class DetailPerhitunganModel(db.Model):
    __tablename__ = 'detail_perhitungan'
    id = db.Column(db.Integer, primary_key=True)
    perhitungan_id = db.Column(db.Integer, db.ForeignKey('perhitungan.perhitungan_id'), nullable=False)
    confussion_matrix = db.Column(db.Text, nullable=True)
    f1_score = db.Column(db.Text, nullable=True)
    precision = db.Column(db.Text, nullable=True)
    recall = db.Column(db.Text, nullable=True)
    accuracy = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    dataset_info = db.Column(db.Text, nullable=True)
    classes = db.Column(db.Text, nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    detail_to_perhitungan = db.relationship('PerhitunganModel', backref=db.backref('details', lazy=True))

   

    def to_dict(self):
        f1_list = ast.literal_eval(self.f1_score)
        precision_list = ast.literal_eval(self.precision)
        recall_list = ast.literal_eval(self.recall)

        return {
            'id': self.id,
            'perhitungan_id': self.perhitungan_id,
            'confussion_matrix': self.confussion_matrix,
            'f1_score': self.f1_score,
            'precision': self.precision,
            'recall': self.recall,
            'classes': self.classes,
            'accuracy': self.accuracy,
            'avgf1score': sum(f1_list) / len(f1_list),
            'avgprecision': sum(precision_list) / len(precision_list),
            'avgrecall': sum(recall_list) / len(recall_list),
            'dataset_info': self.dataset_info,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
