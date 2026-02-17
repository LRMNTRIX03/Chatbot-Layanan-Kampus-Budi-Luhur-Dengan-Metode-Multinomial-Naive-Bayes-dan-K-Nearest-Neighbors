from flask import jsonify, request
from app.models.slangwordsModel import SlangwordsModel
from app.extensions import db


class SlangwordsController:
    def get_all_slangwords(self):
        try :
            slangwords = SlangwordsModel.query.all()
            data = [word.to_dict() for word in slangwords]
            return jsonify({
                "data" : data
            }), 200
        except Exception as e:
            return jsonify({'message': 'Error retrieving slang words', 'error': str(e)}), 500
        
    def get_by_id_slangwords(self,id):
        try:
            slangwords = SlangwordsModel.query.get(id)
            if not slangwords:
                return jsonify({'message': 'Slang word not found'}), 404
            data = slangwords.to_dict()
            return jsonify({
                "data" : data
            }), 200
            
        except Exception as e:
            return jsonify({'message': 'Error retrieving slang word', 'error': str(e)}), 500
    def create_slangwords(self, data):
        try:
            if not data.get("kata_baku") or not data.get("kata_tbaku"):
                return jsonify({"error": "Data is missing"}), 400

            kata_baku = data["kata_baku"].lower()
            kata_tbaku = data["kata_tbaku"].lower()
            last_number = db.session.query(db.func.count(SlangwordsModel.id)).scalar() or 0
            new_id = str(last_number + 1).zfill(4)
            slangword = SlangwordsModel(kata_baku=kata_baku, kata_tbaku=kata_tbaku, id=new_id)

            db.session.add(slangword)
            db.session.commit()

            return jsonify({"message": "Slang word created successfully",
            "data": slangword.to_dict()}), 201

        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e), "message": "Failed to create slang word"}), 500
        
    def update_slangwords(self, data, id):
        try:
            slangword = SlangwordsModel.query.get(id)
            if not data.get("kata_baku") or not data.get("kata_tbaku"):
                return jsonify({"error": "Gagal mengupdate slang word"}), 400
            
            kata_baku = data["kata_baku"].lower()
            kata_tbaku = data["kata_tbaku"].lower()
            slangword.kata_baku = kata_baku
            slangword.kata_tbaku = kata_tbaku
            db.session.commit()
            return jsonify({"message": "Slang word updated successfully"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e), "message": "Failed to update slang word"}), 500
        
    def delete_slangwords(self, id):
        try:
            slangword = SlangwordsModel.query.get(id)
            if not slangword:
                return jsonify({"error": "Slang word not found"}), 404
            db.session.delete(slangword)
            db.session.commit()
            return jsonify({"message": "Slang word deleted successfully"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e), "message": "Failed to delete slang word"}), 500
    
