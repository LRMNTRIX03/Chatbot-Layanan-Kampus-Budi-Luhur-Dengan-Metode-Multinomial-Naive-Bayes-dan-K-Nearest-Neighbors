import os
import json
import pickle
import random
import re
from flask import jsonify, request
from app.extensions import db
from app.models import PerhitunganModel, DetailPerhitunganModel, PreprocessingModel
from app.utils.Preprocessing import Preprocessing
from app.models.responseModel import ResponseModel
from app.models.intentModel import IntentModel
from app.utils.NB import MultinomialNaiveBayes
from app.utils.Knn import KNNClassifier
from app.utils.tfidf import TFIDFVectorizer 
from app.models.patternModel import PatternModel
from collections import Counter
from app.utils.wordsBuilder import WordsBuilder
import traceback

class TrainingController:

    def __init__(self):
        self.KNN_MODEL_PATH = "models/knn_classifier.pkl"
        self.MODEL_PATH = "models/naive_bayes.pkl"
        self.TFIDF_PATH = "models/tfidf_vectorizer.pkl"
        self.preprocessor = Preprocessing()
        self.word_builder = WordsBuilder()
        self.model = None
        self.vectorizer = None
        self.kampus_words = self.word_builder.build_kampus_words_from_csv(
                csv_path="app/data/patterns.csv",
                min_freq=1
        )
    def map_gelar(self, text):
        gelar_mapping = {
            "s1": "sarjana",
            "s2": "pascasarjana",
            "s3": "doktor",
            "d3": "diploma",
            "d4": "sarjana"
        }

        text = text.lower()

        for short, full in gelar_mapping.items():
            pattern = r'\b' + re.escape(short) + r'\b'
            text = re.sub(pattern, full, text)

        return text
    
    def is_kampus_related(self, text):
        text = text.lower()
        tokens = re.findall(r'\b[a-zA-Z]+\b', text)
        return any(token in self.kampus_words for token in tokens)

    
    def train_model(self, rasio="80:20"):
        try:
            missing_text = []
            
            try:
                self.vectorizer = TFIDFVectorizer.load(self.TFIDF_PATH)
            except FileNotFoundError:
                return jsonify({
                    "message": "TF-IDF belum dihitung. Silakan compute TF-IDF terlebih dahulu.",
                    "error": "TFIDF_NOT_COMPUTED"
                }), 400
            
            
            preprocessed_data = PreprocessingModel.query.all()
            
            if not preprocessed_data:
                return jsonify({
                    "message": "Tidak ada data preprocessing untuk training",
                    "error": "NO_DATA"
                }), 400
            
            texts, labels = [], []
            for p in preprocessed_data:
                preprocessed_text = " ".join(p.preprocessed_text.split(",")) or p.stemming_text
                
                if preprocessed_text and preprocessed_text.strip() and p.pre_relations:
                    intent_name = p.pre_relations.intent_to_pattern.name if p.pre_relations.intent_to_pattern else None
                    
                    if intent_name:
                        texts.append(preprocessed_text.strip())
                        labels.append(intent_name)
                else:
                        missing_text.append(preprocessed_text.strip())
            
            if len(texts) < 10:
                return jsonify({
                    "message": f"Data pattern terlalu sedikit ({len(texts)}). Minimal 10 pattern diperlukan.",
                    "error": "INSUFFICIENT_DATA"
                }), 400
            
           
            label_counts = Counter(labels)
            classes_with_few_samples = {k: v for k, v in label_counts.items() if v < 3}
            warning_msg = ""
            if classes_with_few_samples:
                warning_msg = "Beberapa intent memiliki pattern terlalu sedikit: " + \
                            ", ".join([f"{k}({v})" for k, v in classes_with_few_samples.items()])
            
            print(f"\n{'='*60}")
            print("TRAINING Multinomial Naive Bayes")
            print(f"{'='*60}")
            print(f"Total data: {len(texts)} | Intents: {len(set(labels))}")
            
            
            print("🔄 Transforming texts to TF-IDF vectors (sparse format)...")
            X = self.vectorizer.transform(texts)
            y = labels
            
            rasio_test = 0.2 if rasio == "80:20" else 0.3
            X_train, X_test, y_train, y_test = MultinomialNaiveBayes.train_test_split(
                X, y,
                test_size=rasio_test,
                stratify=True,
                random_state=42
            )
            print(f"Train size: {len(X_train)}, Test size: {len(X_test)}")
            print(f"\n\n Missing Text : {missing_text}")
            self.model = MultinomialNaiveBayes()
            self.model.set_vocab_mapping(self.vectorizer.word_to_index)
            self.model.proses_latih(X_train, y_train)
            metrics = self.model.evaluate(X_test, y_test)
            self.model.save_model(self.MODEL_PATH)
            data_perhitungan = PerhitunganModel(
                rasio=rasio,
                model="MultinomialNB-TFIDF"
            )
            db.session.add(data_perhitungan)
            db.session.flush()
            data_detail = DetailPerhitunganModel(
                perhitungan_id=data_perhitungan.perhitungan_id,
                confussion_matrix=json.dumps(metrics["confusion_matrix"]),
                f1_score=json.dumps(metrics["f1_score"]),
                precision=json.dumps(metrics["precision"]),
                recall=json.dumps(metrics["recall"]),
                accuracy=str(metrics["accuracy"]),
                dataset_info=json.dumps({
                    "total_data": len(texts),
                    "train_size": len(X_train),
                    "test_size": len(X_test),
                    "num_classes": len(set(labels)),
                    "distribution": dict(label_counts)
                }),
                classes=json.dumps(metrics["classes"])
            )
            db.session.add(data_detail)
            db.session.commit()
            
            return jsonify({
                "message": "Training berhasil dilakukan!",
                "status": "success",
                "akurasi": float(metrics["accuracy"]),
                "avgPrecision": float(metrics["macro_precision"]),
                "avgRecall": float(metrics["macro_recall"]),
                "avgF1": float(metrics["macro_f1"]),
                "classes": metrics["classes"],
                "precision": [float(p) for p in metrics["precision"]],
                "recall": [float(r) for r in metrics["recall"]],
                "f1": [float(f) for f in metrics["f1_score"]],
                "confusion_matrix": metrics["confusion_matrix"],
                "dataset_info": {
                    "total_data": len(texts),
                    "train_size": len(X_train),
                    "test_size": len(X_test),
                    "num_classes": len(set(labels)),
                    "distribution": dict(label_counts)
                },
                "warnings": [warning_msg] if warning_msg else []
            }), 200
        
        except Exception as e:
            db.session.rollback()
            traceback.print_exc()
            return jsonify({
                "message": "Training gagal",
                "status": "error",
                "error": str(e),
                "traceback": traceback.format_exc()
            }), 500
    
    def predict_message(self, user_input):
        self.preprocessor = Preprocessing()
        try:
            print("User Input :", user_input)
            if len(user_input) <=1 :
                return jsonify({
                    "message" : "Maaf saya tidak mengerti perkataan anda"
                })
            
            if not user_input:
                return jsonify({
                    "message": "Teks tidak boleh kosong",
                    "error": "EMPTY_INPUT"
                }), 400
            user_input = self.map_gelar(user_input)
            prepro_input = self.preprocessor.preprocessing(user_input)
            print("Preprocessed Input :", prepro_input)
            if not self.is_kampus_related(prepro_input):
                return jsonify({
                    "status": "out_of_domain",
                    "response": "Maaf, saya hanya dapat menjawab pertanyaan seputar akademik dan kampus."
                }), 200
            
            print(f"\n{'='*60}")
            print(f"Processing: '{user_input}'")
            print(f"{'='*60}")
            try:
                self.model = MultinomialNaiveBayes.load_model(self.MODEL_PATH)
                self.vectorizer = TFIDFVectorizer.load(self.TFIDF_PATH)
            except FileNotFoundError:
                return jsonify({
                    "message": "Model belum dilatih. Silakan training terlebih dahulu.",
                    "error": "MODEL_NOT_FOUND"
                }), 400
            preprocessed_input = self.preprocessor.preprocessing(user_input)
            print(f"Preprocessed: {preprocessed_input}")
            tfidf_vec = self.vectorizer.transform(preprocessed_input)
            probabilities = self.model.predict_proba(tfidf_vec)
            predicted_intent = max(probabilities, key=probabilities.get)
            confidence = probabilities[predicted_intent]
            
            print(f"Predicted: {predicted_intent}")
            print(f"Confidence: {confidence:.4f}")
            # top_tfidf_words = self.vectorizer.get_top_tfidf_words(preprocessed_input, top_n=10)
            THRESHOLD = 0.05
            if confidence < THRESHOLD:
                top3 = sorted(probabilities.items(), key=lambda x: x[1], reverse=True)[:3]
                suggestions = [f"{intent} ({prob*100:.1f}%)" for intent, prob in top3]
                
                print("Maaf, saya kurang yakin dengan maksud Anda.")
                print("   Kemungkinan lain:")
                for s in suggestions:
                    print("   •", s)
                
                return jsonify({
                    "status": "uncertain",
                    "input": user_input,
                    "preprocessed_input": preprocessed_input,
                    "predicted_intent": predicted_intent,
                    "confidence": float(confidence),
                    # "top_tfidf_words": top_tfidf_words,
                    "response": "Maaf, saya kurang mengerti maksud Anda. Bisa dijelaskan lebih lanjut?"
                }), 200
            intent = IntentModel.query.filter_by(name=predicted_intent).first()
            if not intent:
                return jsonify({
                    "status": "error",
                    "error": "INTENT_NOT_FOUND",
                    "predicted_intent": predicted_intent
                }), 200
            
            responses = ResponseModel.query.filter_by(intent_id=intent.id).all()
            if not responses:
                return jsonify({
                    "status": "error",
                    "error": "NO_RESPONSE",
                    "predicted_intent": predicted_intent
                }), 200
            
            selected_response = random.choice(responses).text
            # print(f"Top 3 Label : {top3}")
            
            return jsonify({
                # "status": "success",
                "input": user_input,
                # "preprocessed_input": preprocessed_input,
                # "predicted_intent": predicted_intent,
                # "confidence": float(confidence),
                # "probabilities": {k: float(v) for k, v in probabilities.items()},
                # "top_tfidf_words": top_tfidf_words,
                "response": selected_response
            }), 200
        
        except Exception as e:
            print("Error saat prediksi:", str(e))
            traceback.print_exc()
            return jsonify({
                "message": "Prediksi gagal",
                "status": "error",
                "error": str(e),
                "traceback": traceback.format_exc()
            }), 500
    def train_model_knn(self, rasio="80:20", k=3):
            try:  
                print("Nilai K :", k)
                try:
                    self.vectorizer = TFIDFVectorizer.load(self.TFIDF_PATH)
                except FileNotFoundError:
                    return jsonify({
                        "message": "TF-IDF belum dihitung. Silakan compute TF-IDF terlebih dahulu.",
                        "error": "TFIDF_NOT_COMPUTED"
                    }), 400
                preprocessed_data = PreprocessingModel.query.all()
                
                if not preprocessed_data:
                    return jsonify({
                        "message": "Tidak ada data preprocessing untuk training",
                        "error": "NO_DATA"
                    }), 400
                texts, labels = [], []
                for p in preprocessed_data:
                    preprocessed_text = " ".join(p.preprocessed_text.split(",")) or p.stemming_text
                    
                    if preprocessed_text and preprocessed_text.strip() and p.pre_relations:
                        intent_name = p.pre_relations.intent_to_pattern.name if p.pre_relations.intent_to_pattern else None
                        
                        if intent_name:
                            texts.append(preprocessed_text.strip())
                            labels.append(intent_name)
                if len(texts) < 10:
                    return jsonify({
                        "message": f"Data pattern terlalu sedikit ({len(texts)}). Minimal 10 pattern diperlukan.",
                        "error": "INSUFFICIENT_DATA"
                    }), 400
                label_counts = Counter(labels)
                classes_with_few_samples = {k: v for k, v in label_counts.items() if v < 3}
                warning_msg = ""
                if classes_with_few_samples:
                    warning_msg = "Beberapa intent memiliki pattern terlalu sedikit: " + \
                                ", ".join([f"{k}({v})" for k, v in classes_with_few_samples.items()])
                
                print(f"\n{'='*60}")
                print("TRAINING KNN Classifier")
                print(f"{'='*60}")
                print(f"Total data: {len(texts)} | Intents: {len(set(labels))}")
                X = self.vectorizer.transform(texts)
                y = labels
                rasio_test = 0.2 if rasio == "80:20" else 0.3
                X_train, X_test, y_train, y_test = KNNClassifier.train_test_split(
                    X, y,
                    test_size=rasio_test,
                    stratify=True,
                    random_state=42
                )
                print(f"Train size: {len(X_train)}, Test size: {len(X_test)}")
                self.model = KNNClassifier(k=k)
                self.model.proses_latih(X_train, y_train)
                metrics = self.model.evaluate(X_test, y_test)
                self.model.save_model(self.KNN_MODEL_PATH)
                data_perhitungan = PerhitunganModel(
                    rasio=rasio,
                    model="KNN-TFIDF",
                    k_val=str(k)
                )
                db.session.add(data_perhitungan)
                db.session.flush()
                data_detail = DetailPerhitunganModel(
                    perhitungan_id=data_perhitungan.perhitungan_id,
                    confussion_matrix=json.dumps(metrics["confusion_matrix"]),
                    f1_score=json.dumps(metrics["f1_score"]),
                    precision=json.dumps(metrics["precision"]),
                    recall=json.dumps(metrics["recall"]),
                    accuracy=str(metrics["accuracy"]),
                    dataset_info=json.dumps({
                        "total_data": len(texts),
                        "train_size": len(X_train),
                        "test_size": len(X_test),
                        "num_classes": len(set(labels)),
                        "distribution": dict(label_counts),
                        "k_neighbors": k,
                        "distance_metric": "Cosine Similarity"
                    }),
                    classes=json.dumps(metrics["classes"])
                )
                db.session.add(data_detail)
                db.session.commit()
                
                
                return jsonify({
                    "message": "Training KNN berhasil dilakukan!",
                    "status": "success",
                    "akurasi": float(metrics["accuracy"]),
                    "avgPrecision": float(metrics["macro_precision"]),
                    "avgRecall": float(metrics["macro_recall"]),
                    "avgF1": float(metrics["macro_f1"]),
                    "classes": metrics["classes"],
                    "precision": [float(p) for p in metrics["precision"]],
                    "recall": [float(r) for r in metrics["recall"]],
                    "f1": [float(f) for f in metrics["f1_score"]],
                    "confusion_matrix": metrics["confusion_matrix"],
                    "dataset_info": {
                        "total_data": len(texts),
                        "train_size": len(X_train),
                        "test_size": len(X_test),
                        "num_classes": len(set(labels)),
                        "distribution": dict(label_counts),
                        "k_neighbors": k,
                    },
                    "warnings": [warning_msg] if warning_msg else []
                }), 200
            
            except Exception as e:
                db.session.rollback()
                traceback.print_exc()
                return jsonify({
                    "message": "Training KNN gagal",
                    "status": "error",
                    "error": str(e),
                    "traceback": traceback.format_exc()
                }), 500
        
    def predict_message_knn(self, user_input):
            try:
                print("User Input :", user_input)
                if len(user_input) <=1 :
                    return jsonify({
                        "message" : "Maaf saya tidak mengerti perkataan anda"
                    })
                if not user_input:
                    return jsonify({
                        "message": "Teks tidak boleh kosong",
                        "error": "EMPTY_INPUT"
                    }), 400
                print(f"\n{'='*60}")
                print(f"Processing: '{user_input}'")
                print(f"{'='*60}")
                user_input = self.map_gelar(user_input)
                prepro = self.preprocessor.preprocessing(user_input)
                if not self.is_kampus_related(prepro):
                    return jsonify({
                        "status": "out_of_domain",
                        "response": "Maaf, saya hanya dapat menjawab pertanyaan seputar akademik dan kampus."
                    }), 200
                try:
                    self.model = KNNClassifier.load_model(self.KNN_MODEL_PATH)
                    self.vectorizer = TFIDFVectorizer.load(self.TFIDF_PATH)
                except FileNotFoundError:
                    return jsonify({
                        "message": "Model KNN belum dilatih. Silakan training terlebih dahulu.",
                        "error": "MODEL_NOT_FOUND"
                    }), 400
                
               
                preprocessed_input = self.preprocessor.preprocessing(user_input)
                print(f"Preprocessed: {preprocessed_input}")
                tfidf_vec = self.vectorizer.transform(preprocessed_input)
                probabilities = self.model.predict_proba(tfidf_vec)
                predicted_intent = max(probabilities, key=probabilities.get)
                confidence = probabilities[predicted_intent]
                print(f"Predicted: {predicted_intent}")
                print(f"Confidence: {confidence:.4f}")
                # top_tfidf_words = self.vectorizer.get_top_tfidf_words(preprocessed_input, top_n=10)
                THRESHOLD = 0.45
                if confidence < THRESHOLD:
                    top3 = sorted(probabilities.items(), key=lambda x: x[1], reverse=True)[:3]
                    suggestions = [f"{intent} ({prob*100:.1f}%)" for intent, prob in top3]
                    
                    print("Maaf, saya kurang yakin dengan maksud Anda.")
                    print("Kemungkinan lain:")
                    for s in suggestions:
                        print("   •", s)
                    
                    return jsonify({
                        "status": "uncertain",
                        # "input": user_input,
                        "preprocessed_input": preprocessed_input,
                        "predicted_intent": predicted_intent,
                        "confidence": float(confidence),
                        # "top_tfidf_words": top_tfidf_words,
                        "k_neighbors": self.model.k,
                        "response": "Maaf, saya kurang mengerti maksud Anda. Bisa dijelaskan lebih lanjut?"
                    }), 200
                
                
                intent = IntentModel.query.filter_by(name=predicted_intent).first()
                if not intent:
                    return jsonify({
                        "status": "error",
                        "error": "INTENT_NOT_FOUND",
                        "predicted_intent": predicted_intent
                    }), 200
                
                responses = ResponseModel.query.filter_by(intent_id=intent.id).all()
                if not responses:
                    return jsonify({
                        "status": "error",
                        "error": "NO_RESPONSE",
                        "predicted_intent": predicted_intent
                    }), 200
                
                selected_response = random.choice(responses).text
                
            
                return jsonify({
                    "status": "success",
                    "input": user_input,
                    # "preprocessed_input": preprocessed_input,
                    # "predicted_intent": predicted_intent,
                    # "confidence": float(confidence),
                    # "probabilities": {k: float(v) for k, v in probabilities.items()},
                    # "top_tfidf_words": top_tfidf_words,
                    # "k_neighbors": self.model.k,
                    "response": selected_response
                }), 200
            
            except Exception as e:
                print("Error saat prediksi:", str(e))
                traceback.print_exc()
                return jsonify({
                    "message": "Prediksi KNN gagal",
                    "status": "error",
                    "error": str(e),
                    "traceback": traceback.format_exc()
                }), 500
