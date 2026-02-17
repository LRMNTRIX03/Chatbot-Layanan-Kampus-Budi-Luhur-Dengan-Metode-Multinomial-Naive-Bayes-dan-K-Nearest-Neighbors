from flask import jsonify
from app.models.intentModel import IntentModel
from app.extensions import db
import pandas as pd
from sqlalchemy.dialects.mysql import insert
import re

class IntentController:
    def create(self, data):
        try :
            if not data.get("name") or not data.get("description"):
                return jsonify({"error": "name or description is missing"}), 400
            name = data["name"]
            description = data["description"]
            intent = IntentModel(name=name, description=description)
            db.session.add(intent)
            db.session.commit()
            return jsonify({"data": {
                "name" : intent.name,
                "description" : intent.description,
                "message": "Intent created successfully"
                }}), 200
        except Exception as e:
            db.session.rollback()
            print("error", e)
            return jsonify({"error": str(e), "message": "Failed to create intent"}), 500

    def update(self, data, id):
        try:
        
            intent = IntentModel.query.get(id)
            if not intent:
                return jsonify({"error": "Intent not found"}), 404

            
            if not data.get("name") or not data.get("description"):
                return jsonify({"error": "Name or description is missing"}), 400
            intent.name = data["name"]
            intent.description = data["description"]
            db.session.commit()

            return jsonify({
                "message": "Intent updated successfully",
                "data": {
                    "id": intent.id,
                    "name": intent.name,
                    "description": intent.description
                }
            }), 200

        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500
        
    def delete(self, id):
        try:
            intent = IntentModel.query.get(id)
            if not intent:
                return jsonify({"Error data tidak ditemukan"}), 404
            db.session.delete(intent)
            db.session.commit()
            return jsonify({"message": "Intent deleted successfully"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e), "message": "Failed to delete intent"}), 500
        
    def get_all(self):
        try:
            data = IntentModel.query.all()
            intent = [d.to_dict() for d in data]
            return jsonify({"data": intent}), 200
        except:
            return jsonify({"error": "Failed to get intents"}), 500
        
    def get_by_id(self, id):
        try:
            data = IntentModel.query.get(id)
            intent = data.to_dict()
            # print(intent)
            return jsonify({"data": intent}), 200
        
        except:
            return jsonify({"error": "Failed to get intent"}), 500
        
    def upload(self, file):
        try:
            if not file:
                return jsonify({"message": "No file provided"}), 400

            if not file.filename.endswith(".csv"):
                return jsonify({"message": "Please upload a CSV file"}), 400

          

            df = pd.read_csv(file.stream, delimiter=',', encoding='utf-8')


            for col in df.select_dtypes(include=['object']).columns:
                df[col] = df[col].str.lower().str.strip()

            data = df.to_dict(orient="records")

            columns = IntentModel.__table__.columns.keys()
            data = [{k: v for k, v in row.items() if k in columns} for row in data]

            stmt = insert(IntentModel).values(data)
            update_dict = {"description": stmt.inserted.description}  
            stmt = stmt.on_duplicate_key_update(**update_dict)

            db.session.execute(stmt)
            db.session.commit()

            return jsonify({
                "message": "Intents uploaded or updated successfully",
                "success": True
            }), 200

        except Exception as e:
            db.session.rollback()
            print("error:", e)
            return jsonify({
                "message": "An error occurred while uploading intents.",
                "error": str(e)
            }), 500
