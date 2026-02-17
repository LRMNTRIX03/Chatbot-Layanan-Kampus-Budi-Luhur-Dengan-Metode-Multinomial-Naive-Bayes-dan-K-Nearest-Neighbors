from flask import jsonify, request
from app.models.stopwordsModel import StopwordsModel
from app.extensions import db


class StopwordsController:
    def getAll(self):
        try:
            data = [x.to_dict() for x in StopwordsModel.query.all()]
            return jsonify({"data": data}), 200
            
        except Exception as e:
            print(f"Error : {e}")
            return jsonify({"error": f"Gagal mengambil data : {e}"}), 500
        
    def getById(self,id):
        try:
            data = StopwordsModel.query.get(id)
            return jsonify({"data": data.to_dict()}), 200
        except Exception as e:
            print(f"Error : {e}")
            return jsonify({"error": f"Gagal mengambil data : {e}"}), 500
    def create(self,data):
        try:
            if data.get("text") is None:
                return jsonify({"error": "Data is missing"}), 400
            text = data["text"]
            stopwords = StopwordsModel(text=text)
            db.session.add(stopwords)
            db.session.commit()
            return jsonify({"data": stopwords.to_dict()}), 200
        except Exception as e:
            db.session.rollback()
            print(f"Error : {e}")
            return jsonify({"error": f"Gagal mengambil data : {e}"}), 500
    def update(self,data,id):
        try:
            if data.get("text") is None:
                return jsonify({"error": "Data is missing"}), 400
            text = data["text"]
            stopwords = StopwordsModel.query.get(id)
            if not stopwords :
                return jsonify({
                    "message": "Data tidak ditemukan"
                }), 404
            stopwords.text = text
            db.session.commit()
            return jsonify({"data": stopwords.to_dict()}), 200
        except Exception as e:
            db.session.rollback()
            print(f"Error : {e}")
            return jsonify({"error": f"Gagal mengambil data : {e}"}), 500
    def delete(self,id):
        try:
            stopwords = StopwordsModel.query.get(id)
            if not stopwords :
                return jsonify({
                    "message": "Data tidak ditemukan"
                }), 404
            db.session.delete(stopwords)
            db.session.commit()
            return jsonify({"message": "Data berhasil dihapus"}), 200
        except Exception as e:
            db.session.rollback()
            print(f"Error : {e}")
            return jsonify({"error": f"Gagal mengambil data : {e}"}), 500