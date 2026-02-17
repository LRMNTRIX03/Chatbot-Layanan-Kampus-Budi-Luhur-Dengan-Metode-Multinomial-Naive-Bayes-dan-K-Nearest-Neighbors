from app.utils.Preprocessing import Preprocessing
from flask import jsonify
from app.extensions import db
from app.models.preprocessingModel import PreprocessingModel
from app.models.patternModel import PatternModel
from datetime import datetime

class PreprocessingController:
    def __init__(self):
        self.preprocessor = Preprocessing()
    def to_text(self,value):
        if isinstance(value, list):
            return ",".join(value)
        return value


    def preprocessing(self):
        PreprocessingModel.query.delete()
        results = []
        records = []  
        patterns = PatternModel.query.all()

        for pattern in patterns:
            text = getattr(pattern, 'text', None)

            if not text:
                text = ""
            elif not isinstance(text, str):
                text = str(text)

            clean_text_result = self.preprocessor.clean_text(text)
            case_folding_result = self.preprocessor.case_folding(clean_text_result)
            slangwords_result = self.preprocessor.slangwords_replacement(case_folding_result)
            tokenization_result = self.preprocessor.tokenization(slangwords_result)
            stopword_result = self.preprocessor.stopword_removal(tokenization_result)
            stemming_result = self.preprocessor.stemming(stopword_result)
            final_text = ",".join(stemming_result.split())

            
            if not final_text:
                print(f"⚠️ SKIP: Pattern ID {pattern.id} karena hasil preprocessing kosong")
                continue

            results.append({
                "pattern_id": pattern.id,
                "original": text,
                "case_folding": case_folding_result,
                "clean_text": clean_text_result,
                "stopword_removal": stopword_result,
                "stemming": stemming_result,
                "final": final_text
            })

            records.append(PreprocessingModel(
                pattern_id=pattern.id,
                case_folding_text=case_folding_result,
                clean_text_result=clean_text_result,
                stopword_removal_text=",".join(stopword_result.split()),
                stemming_text=",".join(stemming_result.split()),
                slangwords_result=slangwords_result,
                tokenization_text=self.to_text(tokenization_result),
                preprocessed_text=final_text,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            ))

        db.session.bulk_save_objects(records)
        db.session.commit()

        return results

    def get_data(self):
        try:
            result = [p.to_dict() for p in PreprocessingModel.query.all()]  
            return jsonify({"data": result})
        except Exception as e:
            print(f"Error : {e}")
            return jsonify({"error": f"Gagal mengambil data : {e}"}), 500
 
