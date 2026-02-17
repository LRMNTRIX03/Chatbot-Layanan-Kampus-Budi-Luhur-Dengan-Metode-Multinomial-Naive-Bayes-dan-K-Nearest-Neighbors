from flask import jsonify, request
from collections import Counter, defaultdict
from app.models import PreprocessingModel
from app.extensions import db
from app.utils.tfidf import TFIDFVectorizer
import traceback
import os
import pandas as pd


class TFIDFController:
    
    def __init__(self):
        self.TFIDF_PATH = "models/tfidf_vectorizer.pkl"
        self.vectorizer = None
    
    def compute_and_save_tfidf(self):
        try:
            print("\n" + "="*60)
            print("Starting TF-IDF Computation")
            print("="*60) 
            preprocessed_data = PreprocessingModel.query.all()
            print(f"Total records in database: {len(preprocessed_data)}")
            if not preprocessed_data:
                print("Tidak ada data preprocessing ditemukan.")
                return jsonify({
                    "message": "Tidak ada data preprocessing",
                    "error": "NO_DATA"
                }), 400
            
            documents = []
            labels = []
            
            for p in preprocessed_data:
                preprocessed_text = " ".join(p.preprocessed_text.split(",")) or p.stemming_text
                if preprocessed_text and preprocessed_text.strip() and p.pre_relations:
                    intent_name = p.pre_relations.intent_to_pattern.name if p.pre_relations.intent_to_pattern else None
                    if intent_name:
                        documents.append(preprocessed_text.strip())
                        labels.append(intent_name)
            
            print(f"Valid documents collected: {len(documents)}")
            
            if len(documents) < 10:
                print(f" Data terlalu sedikit: {len(documents)} documents")
                return jsonify({
                    "message": f"Data terlalu sedikit ({len(documents)}). Minimal 10 dokumen diperlukan.",
                    "error": "INSUFFICIENT_DATA"
                }), 400
            
            print(f"Ready to compute TF-IDF for {len(documents)} documents")
            self.vectorizer = TFIDFVectorizer()
            self.vectorizer.fit(documents)
            print(f"Saving vectorizer to: {self.TFIDF_PATH}")
            self.vectorizer.save(self.TFIDF_PATH)
            stats = self.vectorizer.get_statistics()
            print(f"TF-IDF computation completed successfully!")
            print("="*60)
            
            return jsonify({
                "status": "success",
                "message": "TF-IDF berhasil dihitung dan disimpan",
                "statistics": stats
            }), 200
        
        except Exception as e:
            print("\n" + "="*60)
            print("ERROR in compute_and_save_tfidf")
            print("="*60)
            traceback.print_exc()
            print("="*60)
            
            return jsonify({
                "message": "Gagal menghitung TF-IDF",
                "status": "error",
                "error": str(e),
                "traceback": traceback.format_exc()
            }), 500
    
    def get_tfidf_statistics(self):
        try:
            if self.vectorizer is None:
                if not os.path.exists(self.TFIDF_PATH):
                    return jsonify({
                        "message": "TF-IDF belum dihitung. Silakan compute TF-IDF terlebih dahulu.",
                        "error": "TFIDF_NOT_COMPUTED"
                    }), 400
                self.vectorizer = TFIDFVectorizer.load(self.TFIDF_PATH)
            preprocessed_data = PreprocessingModel.query.all()
            
            if not preprocessed_data:
                return jsonify({
                    "message": "Tidak ada data preprocessing",
                    "error": "NO_DATA"
                }), 400
            
            intent_documents = defaultdict(list)
            
            for p in preprocessed_data:
                preprocessed_text = " ".join(p.preprocessed_text.split(",")) or p.stemming_text
                
                if preprocessed_text and preprocessed_text.strip() and p.pre_relations:
                    intent_name = p.pre_relations.intent_to_pattern.name if p.pre_relations.intent_to_pattern else None
                    
                    if intent_name:
                        intent_documents[intent_name].append(preprocessed_text.strip())
            intent_statistics = []
            for intent_name, docs in intent_documents.items():
                tfidf_vectors = self.vectorizer.transform(docs)
                intent_tfidf_sum = Counter()
                for tfidf_dict in tfidf_vectors:
                    for word, score in tfidf_dict.items():
                        intent_tfidf_sum[word] += score
                top_words = intent_tfidf_sum.most_common(10)
                
                intent_vocab = set()
                intent_total_words = 0
                for doc in docs:
                    tokens = doc.strip().split()
                    print(f"Tokens: {tokens}")
                    intent_vocab.update(tokens)
                    intent_total_words += len(tokens)
                avg_tfidf = sum(intent_tfidf_sum.values()) / len(intent_tfidf_sum) if intent_tfidf_sum else 0
                intent_statistics.append({
                    "intent": intent_name,
                    "total_documents": len(docs),
                    "total_words": intent_total_words,
                    "vocab_size": len(intent_vocab),
                    "avg_tfidf_score": round(avg_tfidf, 4),
                    "top_tfidf_words": [
                        {
                            "word": word,
                            "tfidf_score": round(score, 4),
                            "idf_score": round(self.vectorizer.idf.get(word, 0), 4),
                            "tf_score": round(score / self.vectorizer.idf.get(word, 1), 4) if self.vectorizer.idf.get(word, 1) != 0 else 0
                        }
                        for word, score in top_words
                    ]
                })
            
           
            global_stats = self.vectorizer.get_statistics()
            all_docs = [" ".join(p.preprocessed_text.split(",")) or p.stemming_text for p in preprocessed_data]
            token_counts = [len(doc.split()) for doc in all_docs if doc]

            total_words = sum(token_counts)
            avg_words_per_doc = total_words / len(token_counts) if token_counts else 0

            global_stats["total_words"] = total_words
            global_stats["avg_words_per_doc"] = round(avg_words_per_doc, 2)
                        
            return jsonify({
                "status": "success",
                "global_statistics": global_stats,
                "intent_statistics": sorted(intent_statistics, key=lambda x: x['total_documents'], reverse=True)
            }), 200
        
        except Exception as e:
            traceback.print_exc()
            return jsonify({
                "message": "Gagal mendapatkan TF-IDF statistics",
                "status": "error",
                "error": str(e)
            }), 500
    
    