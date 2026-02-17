from app.models.responseModel import ResponseModel
from flask import jsonify, request
from app.extensions import db
import pandas as pd
from sqlalchemy.dialects.mysql import insert
from app.models.intentModel import IntentModel
import csv


class ResponseController:
    def create(self, data):
        try:
            if not data.get("text") or not data.get("intent_id"):
                return jsonify({"error": "Data is missing"}), 400

            text = data["text"].lower()
            intent_id = data["intent_id"]

            response = ResponseModel(text=text, intent_id=intent_id)

            db.session.add(response)
            db.session.commit()

            return jsonify({"message": "Response created successfully",
            "data": response.to_dict()}), 201

        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e), "message": "Failed to create response"}), 500
    def update(self, data, id):
        try:
            response = ResponseModel.query.get(id)
            if not data.get("text") or not data.get("intent_id"):
                return jsonify({"error": "Gagal mengupdate response"}), 400
            
            text = data["text"].lower()
            intent_id = data["intent_id"]
            response.text = text
            response.intent_id = intent_id
            db.session.commit()
            return jsonify({"message": "Response updated successfully"}), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e), "message": "Failed to update response"}), 500
    def getall(self):
        try:
            data = ResponseModel.query.all()
            response = [d.to_dict() for d in data]
            return jsonify({"data": response}), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e), "message": "Failed to get responses"}), 500

    def delete(self, id):
        try:
            response = ResponseModel.query.get(id)
            if not response:
                return jsonify({"error": "Response not found"}), 404
            db.session.delete(response)
            db.session.commit()
            return jsonify({"message": "Response deleted successfully"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e), "message": "Failed to delete response"}), 500
        
    def upload(self, file):
        try:
            if not file:
                return jsonify({"message": "File tidak ditemukan"}), 400

            if not file.filename.endswith(".csv"):
                return jsonify({"message": "Format file harus CSV"}), 400

            df = pd.read_csv(
    file.stream,
    sep=",",
    encoding="utf-8",
    quoting=csv.QUOTE_MINIMAL,  
    quotechar='"',
    escapechar="\\",  
    engine="python",  
    on_bad_lines="skip"  
)
            df.columns = df.columns.str.strip()  

            
            intent_data = IntentModel.query.all()
            intent_dict = {intent.name.lower(): intent.id for intent in intent_data}

            
            df["intent_name"] = df["intent_name"].str.strip().str.lower()
            df["intent_id"] = df["intent_name"].map(intent_dict)

            
            if df["intent_id"].isnull().any():
                unknowns = df.loc[df["intent_id"].isnull(), "intent_name"].unique()
                return jsonify({
                    "message": f"Ada intent_name yang tidak dikenal: {', '.join(unknowns)}"
                }), 400

            existing_texts = {
                r.text.lower() for r in ResponseModel.query.with_entities(ResponseModel.text).all()
            }

            inserted = 0
            skipped = 0

            for _, row in df.iterrows():
                text_value = row["text"].strip().lower()

                if text_value in existing_texts:
                    skipped += 1
                    continue
                response = ResponseModel(
                    text=text_value,
                    intent_id=row["intent_id"]
                )
                db.session.add(response)
                inserted += 1

            db.session.commit()

            return jsonify({
                "message": f"Upload selesai. {inserted} data baru ditambahkan, {skipped} duplikat dilewati.",
                "success": True
            }), 200

        except Exception as e:
            print(f"Error: {e}")
            db.session.rollback()
            return jsonify({
                "error": str(e),
                "message": "Terjadi kesalahan saat upload CSV"
            }), 500

    def get_by_id(self, id):

        try:
            response = ResponseModel.query.get(id)
            if not response:
                return jsonify({"message": "Response not found"}), 404
            return jsonify({"data": response.to_dict()}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e), "message": "Failed to get response"}), 500
            