import math
import pickle
import os
import numpy as np
from collections import Counter


class TFIDFVectorizer: 
    def __init__(self):
        self.vocab = set()
        self.word_to_index = {}
        self.idf = {}
        self.doc_count_per_word = Counter()
        self.total_docs = 0
        self.is_fitted = False
    
    def fit(self, documents):
        print(" Menghitung TF-IDF dari dokumen...")
        self.total_docs = len(documents)
        if self.total_docs == 0:
            raise ValueError("Tidak ada dokumen untuk di-fit!")
        print(f"   Fase 1: Membangun vocabulary dari {self.total_docs} dokumen...")
        for idx, doc in enumerate(documents):
            if idx % 100 == 0:
                print(f"   Progress: {idx}/{self.total_docs}")
            tokens = doc.strip().split() if isinstance(doc, str) else doc
            unique_tokens = set(tokens) 
            for token in unique_tokens:
                self.vocab.add(token)
                self.doc_count_per_word[token] += 1
        print(f"   Fase 2: Membuat mapping vocabulary...")
        self.word_to_index = {word: i for i, word in enumerate(sorted(self.vocab))}
        print(f"   Fase 3: Menghitung IDF untuk {len(self.vocab)} kata unik...")
        for word in self.vocab:
            doc_count = self.doc_count_per_word.get(word, 0)
            self.idf[word] = math.log((self.total_docs + 1) / (doc_count + 1)) + 1
        self.is_fitted = True
        print(f"   TF-IDF fitted!")
        print(f"   Total vocabulary: {len(self.vocab)}")
        print(f"   Vector dimension: {len(self.vocab)}")
        top_idf = sorted(self.idf.items(), key=lambda x: x[1], reverse=True)[:10]
        print(f"   Top 10 kata dengan IDF tertinggi:")
        for word, idf_val in top_idf:
            print(f"      {word}: {idf_val:.4f}") 
    def transform(self, documents):
        if not self.is_fitted:
            raise ValueError("TFIDFVectorizer belum di-fit! Jalankan fit() terlebih dahulu.")
        single_doc = False
        if isinstance(documents, str):
            documents = [documents]
            single_doc = True
        vectors = []
        for doc in documents:
            tokens = doc.strip().split() if isinstance(doc, str) else doc
            vec = self._compute_tfidf_sparse(tokens)
            vectors.append(vec)
        
        return vectors[0] if single_doc else vectors
    def _compute_tfidf_sparse(self, tokens):
        tfidf_dict = {}
        
        if not tokens:
            return tfidf_dict
        tf_counts = Counter(tokens)
        total_words = len(tokens)
        for token, count in tf_counts.items():
            if token in self.vocab:
                tf = count / total_words
                idf = self.idf.get(token, 0)
                tfidf = tf * idf
                tfidf_dict[token] = tfidf
        
        return tfidf_dict
    
    def save(self, path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "wb") as f:
            pickle.dump(self, f)
        print(f" TF-IDF Vectorizer disimpan ke: {path}")
    
    @staticmethod
    def load(path):
        if not os.path.exists(path):
            raise FileNotFoundError(f"File '{path}' tidak ditemukan.")
        
        with open(path, "rb") as f:
            vectorizer = pickle.load(f)
        
        print(f" TF-IDF Vectorizer dimuat dari: {path}")
        return vectorizer
    
    def get_statistics(self):
        if not self.is_fitted:
            return {"error": "TFIDFVectorizer belum di-fit!"}

        top_idf = sorted(self.idf.items(), key=lambda x: x[1], reverse=True)[:20]
        bottom_idf = sorted(self.idf.items(), key=lambda x: x[1])[:20]
        
        return {
            "total_documents": self.total_docs,
            "vocab_size": len(self.vocab),
            "vector_dimension": len(self.vocab),
            "top_idf_words": [
                {"word": word, "idf": round(idf_val, 4)}
                for word, idf_val in top_idf
            ],
            "most_common_words": [
                {"word": word, "idf": round(idf_val, 4), "doc_frequency": self.doc_count_per_word[word]}
                for word, idf_val in bottom_idf
            ]
        }


