from app.models.patternModel import PatternModel
from flask import jsonify, request
from app.extensions import db
import pandas as pd
from sqlalchemy.dialects.mysql import insert
from app.models.intentModel import IntentModel


class PatternController:
    def create(self, data):
        try:
            if not data.get("text") or not data.get("intent_id"):
                return jsonify({
                    "message": "Failed to create pattern",
                }), 400
            text = data["text"]
            intent_id = data["intent_id"]
            pattern = PatternModel(text=text, intent_id=intent_id)
            db.session.add(pattern)
            db.session.commit()
            return jsonify({
                "message": "Pattern created successfully",
                "data": pattern.to_dict()
            }), 200
        
        except Exception as e:
            db.session.rollback()
            print("error:", e)
            return jsonify({
                "message": "An error occurred while creating the pattern.",
                "error": str(e)
            }), 500


            
    def update(self, data, id):
        try:
            if not data.get("text") or not data.get("intent_id"):
                return jsonify({
                    "message": "Gagal mengupdate pattern",
                }), 500
            text = data["text"]
            intent_id = data["intent_id"]
            pattern = PatternModel.query.get(id)
            if not pattern:
                return jsonify({
                    "message": "Pattern tidak ditemukan",
                }), 404
            pattern.text = text
            pattern.intent_id = intent_id
            db.session.commit()
            return jsonify({
                "message": "Pattern berhasil diupdate",
                "data": pattern.to_dict()
            }), 200
            
        except Exception as e:
            print(f"Error : {e}")
        
    def getall(self):
            try:
                data = PatternModel.query.all()
                pattern = [d.to_dict() for d in data]
                return jsonify({
                    "data": pattern,
                    "message": "Data berhasil diambil"
                }), 200
            except Exception as e:
                print(f"Error : {e}")
                return jsonify({"error": "Gagal mengambil data"}), 500

    
    
    def getById(self, id):
        try:
            data = PatternModel.query.get(id)
            pattern = data.to_dict()
            return jsonify({
                "data": pattern,
                "message": "Data berhasil diambil"
            }), 200
        except Exception as e:
            print(f"Error : {e}")
            
    def delete(self, id):
        try:
            pattern = PatternModel.query.get(id)
            if not pattern:
                return jsonify({
                    "message": "Pattern tidak ditemukan",
                }), 404
            db.session.delete(pattern)
            db.session.commit()
            return jsonify({
                "message": "Pattern berhasil dihapus",
            }), 200
            
        except Exception as e:
            print(f"Error : {e}")
    
    def upload(self, file):
        try:
            if not file:
                return jsonify({"message": "File tidak ditemukan"}), 400

            if not file.filename.endswith(".csv"):
                return jsonify({"message": "Format file harus CSV"}), 400

            df = pd.read_csv(file.stream, quotechar='"', sep=',', encoding='utf-8')
            df = df[df["intent_name"].notna() & (df["intent_name"].str.strip() != "")]
            df.columns = df.columns.str.strip()

            intent_data = IntentModel.query.all()
            intent_dict = {intent.name: intent.id for intent in intent_data}
            # print(intent_dict)
            df["text"] = df["text"].fillna("").astype(str)

            df["intent_name"] = df["intent_name"].str.strip().str.lower()
            df["intent_id"] = df["intent_name"].map(intent_dict)

            if df["intent_id"].isnull().any():
                unknowns = df.loc[df["intent_id"].isnull(), "intent_name"].fillna("").astype(str).unique()
                print(unknowns)
                return jsonify({
                    "message": f"Ada intent_name yang tidak dikenal: {', '.join(map(str, unknowns))}"
                }), 400


            existing_texts = {p.text for p in PatternModel.query.with_entities(PatternModel.text).all()}
            inserted = 0
            skipped = 0

            for _, row in df.iterrows():
                text_value = row["text"].replace("nan"," ").strip()
                print(text_value)

                if text_value in existing_texts:
                    skipped += 1
                    continue

                pattern = PatternModel(
                    text=text_value,
                    intent_id=row["intent_id"]
                )
                db.session.add(pattern)
                inserted += 1

            db.session.commit()

            return jsonify({
                "message": f"Upload selesai. {inserted} data baru ditambahkan, {skipped} duplikat dilewati.",
                "success": True
            }), 200

        except Exception as e:
            print(f"Error: {e}")
            db.session.rollback()
            return jsonify({"message": "Terjadi kesalahan saat upload CSV"}), 500
