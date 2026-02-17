import math
import pickle
import random
import numpy as np
from collections import defaultdict, Counter
from app.models.preprocessingModel import PreprocessingModel
from app.models.intentModel import IntentModel
import os


class MultinomialNaiveBayes:    
    def __init__(self):
        self.class_tfidf_sums = defaultdict(Counter)  
        self.class_doc_counts = defaultdict(int)
        self.vocab = set()
        self.word_to_index = {}
        self.total_docs = 0
        self.class_priors = {}
        self.word_probs = {}
        self.classes = []
    
    def proses_latih(self, X, y):
        print(f"Training Multinomial Naive Bayes dengan TF-IDF...")
        print(f"   Total data: {len(X)}")
        
        self.total_docs = len(X)
        if self.total_docs == 0:
            raise ValueError("Tidak ada data training!")
        print("     Membangun vocabulary dari TF-IDF vectors...")
        
        for vec in X:
            self.vocab.update(vec.keys())
            self.word_to_index = {word: idx for idx, word in enumerate(sorted(self.vocab))}
            self.n_features = len(self.vocab)
        
        print(f"   Vocabulary size: {len(self.vocab)}")
        print("   Akumulasi TF-IDF per kelas...")
        for idx, (vec, label) in enumerate(zip(X, y)):
            if idx % 100 == 0:
                print(f"   Progress: {idx}/{self.total_docs}")
            
            self.class_doc_counts[label] += 1

            for word, tfidf_value in vec.items():
                    if tfidf_value > 0:
                        self.class_tfidf_sums[label][word] += tfidf_value
        
        self.classes = sorted(self.class_doc_counts.keys())
        
        print("   Fase 1: Menghitung class priors...")
        for label in self.classes:
            self.class_priors[label] = self.class_doc_counts[label] / self.total_docs
        print(self.class_doc_counts)
        print(self.class_doc_counts[label])
        
       
        print("   Fase 2: Menghitung word probabilities dengan Laplace smoothing...")
        vocab_size = len(self.vocab)
        
        for label in self.class_tfidf_sums:
            total_tfidf_in_class = sum(self.class_tfidf_sums[label].values())
            
            self.word_probs[label] = {}
            for word in self.vocab:
                tfidf_sum = self.class_tfidf_sums[label].get(word, 0)
           
                self.word_probs[label][word] = (tfidf_sum + 1) / (total_tfidf_in_class + vocab_size)
            
            print(f"   Kelas '{label}': {self.class_doc_counts[label]} dokumen "
                  f"({self.class_priors[label]*100:.1f}%), total TF-IDF: {total_tfidf_in_class:.2f}")
        
        print(f"   Training selesai!")
        print(f"   Jumlah kelas: {len(self.classes)}")
        print(f"   Jumlah features: {len(self.vocab)}")
    
    def predict(self, X):
        single = not isinstance(X, list)
        if single:
            X = [X]
        
        predictions = []
        for vec in X:
            scores = self._proses_hitung(vec)
            predicted_label = max(scores, key=scores.get)
            predictions.append(predicted_label)
        
        return predictions[0] if single else predictions
    
    def predict_proba(self, X):
        single = not isinstance(X, list)
        if single:
            X = [X]
        all_probs = []
        for vec in X:
            scores = self._proses_hitung(vec)
            max_score = max(scores.values())
            exp_scores = {label: math.exp(score - max_score) for label, score in scores.items()}
            total = sum(exp_scores.values())
            probabilities = {label: val / total for label, val in exp_scores.items()}
            all_probs.append(probabilities)
        
        return all_probs[0] if single else all_probs
    
    def _proses_hitung(self, vec):
        scores = {}
        for label in self.classes:
            log_prob = math.log(self.class_priors[label])
            for word, tfidf_value in vec.items():
                    if tfidf_value > 0 and word in self.word_probs[label]:
                        log_prob += tfidf_value * math.log(self.word_probs[label][word])
            scores[label] = log_prob
        return scores
    def evaluate(self, X_test, y_test, verbose=True):
        if verbose:
            print(f"\n Mengevaluasi {len(X_test)} data test...")
        y_pred = []
        for idx, x in enumerate(X_test):
            if verbose and idx % 50 == 0:
                print(f"   Prediksi: {idx}/{len(X_test)}")
            pred = self.predict(x)
            y_pred.append(pred)
        
        labels = sorted(list(set(y_test)))
        print(f"   Kelas yang ditemukan: {labels}")
        label_to_idx = {label: i for i, label in enumerate(labels)}
        
        n = len(labels)
        cm = np.zeros((n, n), dtype=int)
        
        for true, pred in zip(y_test, y_pred):
            if true in label_to_idx and pred in label_to_idx:
                cm[label_to_idx[true]][label_to_idx[pred]] += 1
        
      
        total = np.sum(cm)
        accuracy = np.trace(cm) / total if total > 0 else 0.0
        
        precisions, recalls, f1s = [], [], []
        for i in range(n):
            tp = cm[i][i]
            fp = np.sum(cm[:, i]) - tp
            fn = np.sum(cm[i, :]) - tp
            
            precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
            recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
            f1 = (2 * precision * recall / (precision + recall)) if (precision + recall) > 0 else 0.0
            
            precisions.append(precision)
            recalls.append(recall)
            f1s.append(f1)
        
        macro_precision = float(np.mean(precisions)) if precisions else 0.0
        macro_recall = float(np.mean(recalls)) if recalls else 0.0
        macro_f1 = float(np.mean(f1s)) if f1s else 0.0
        
        if verbose:
            print(f"\n📊 Hasil Evaluasi:")
            print(f"   Accuracy: {accuracy*100:.2f}%")
            print(f"   Macro Precision: {macro_precision*100:.2f}%")
            print(f"   Macro Recall: {macro_recall*100:.2f}%")
            print(f"   Macro F1-Score: {macro_f1*100:.2f}%")
        
        return {
            "accuracy": float(accuracy),
            "classes": labels,
            "precision": [float(p) for p in precisions],
            "recall": [float(r) for r in recalls],
            "f1_score": [float(f) for f in f1s],
            "macro_precision": macro_precision,
            "macro_recall": macro_recall,
            "macro_f1": macro_f1,
            "confusion_matrix": cm.tolist(),
        }
    
    def set_vocab_mapping(self, word_to_index):

        self.word_to_index = word_to_index
        self.vocab = set(word_to_index.keys())
        self.n_features = len(self.vocab)
    
    def save_model(self, path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "wb") as f:
            pickle.dump(self, f)
        print(f" Model Naive Bayes disimpan ke: {path}")
    
    @staticmethod
    def load_model(path):
        with open(path, "rb") as f:
            model = pickle.load(f)
        print(f" Model Naive Bayes dimuat dari: {path}")
        return model
    
    @staticmethod
    def train_test_split(X, y, test_size=0.3, random_state=42, stratify=True):
        random.seed(random_state)
        data = list(zip(X, y))

        if stratify:
            grouped = defaultdict(list)
            for x, label in data:
                grouped[label].append((x, label))

            total_test = int(len(data) * test_size)
            test, train = [], []

            for label, items in grouped.items():
                prop = len(items) / len(data)
                n_test = round(prop * total_test)
                random.shuffle(items)
                test += items[:n_test]
                train += items[n_test:]
        else:
            random.shuffle(data)
            split = int(len(data) * (1 - test_size))
            train, test = data[:split], data[split:]
        X_train, y_train = zip(*train)
        X_test, y_test = zip(*test)
        return list(X_train), list(X_test), list(y_train), list(y_test)
    def get_model_info(self):
        print("\n📋 Informasi Model Naive Bayes (TF-IDF):")
        print(f"   Total dokumen training: {self.total_docs}")
        print(f"   Ukuran vocabulary: {len(self.vocab)}")
        print(f"   Jumlah kelas: {len(self.class_tfidf_sums)}")
        print(f"\n   Distribusi kelas:")
        for label, count in self.class_doc_counts.items():
            print(f"      {label}: {count} dokumen ({count/self.total_docs*100:.1f}%)")
        if self.word_probs and self.classes:
            sample_class = self.classes[0]
            print(f"\n   Sample word probabilities untuk kelas '{sample_class}' (top 10):")
            class_words = self.class_tfidf_sums[sample_class].most_common(10)
            for word, tfidf_sum in class_words:
                prob = self.word_probs[sample_class].get(word, 0)
                print(f"      {word}: TF-IDF sum={tfidf_sum:.4f}, P(word|class)={prob:.6f}")

