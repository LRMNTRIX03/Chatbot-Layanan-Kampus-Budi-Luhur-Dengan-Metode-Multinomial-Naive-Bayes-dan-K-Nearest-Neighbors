from app.extensions import db

class SlangwordsModel(db.Model):
    __tablename__ = 'slangwords'
    id = db.Column(db.Integer, primary_key=True)
    kata_baku = db.Column(db.String(50), nullable=False)
    kata_tbaku = db.Column(db.String(50), nullable=False)
   

    def to_dict(self):
        return {
            'id': self.id,
            'kata_baku': self.kata_baku,
            'kata_tbaku': self.kata_tbaku
        }