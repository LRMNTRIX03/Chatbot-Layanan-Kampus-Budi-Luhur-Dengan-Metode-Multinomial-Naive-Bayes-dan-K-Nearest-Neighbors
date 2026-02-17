import pickle
import os
import random
import numpy as np
from collections import defaultdict, Counter
import math

class KNNClassifier:
    def __init__(self, k=3):
      
        self.k = k
        self.train_vectors = []
        self.train_labels = []
    
    def proses_latih(self, X, y):
       
        print(f"Training KNN Classifier...")
        print(f"   K neighbors: {self.k}")
        print(f"   Distance metric: Cosine Similarity")
        print(f"   Total data: {len(X)}")
        
        self.train_vectors = X
        self.train_labels = y
        
        label_counts = Counter(y)
        for label, count in label_counts.items():
            print(f"   Kelas '{label}': {count} dokumen ({count/len(y)*100:.1f}%)")
        
        print(f"   Training selesai!")
    
    def predict(self, X):
       
        if not self.train_vectors:
            raise ValueError("Model belum dilatih!")
        
        single = not isinstance(X, list)
        if single:
            X = [X]
        
        predictions = []
        for vec in X:
            print("     Hitung Similarity untuk data test")
            similarities = self._hitung_jarak(vec)
            print("     Mengurutkan similarity...")
            similarities.sort(key=lambda x: x[0], reverse=True)
            print("     Memilih K tetangga terdekat...")
            top_k_neighbors = similarities[:self.k]
            print(f"     Tetangga terdekat (similarity, label): {top_k_neighbors}")
            votes = Counter([label for _, label in top_k_neighbors])
            print(f"    Cari Voting terbanyak, hasil: {votes}")
            max_votes = max(votes.values())
            candidates = [label for label, count in votes.items() if count == max_votes]
            print(" Proses pilih similarity tertinggi jika seri...")
            if len(candidates) > 1:
                for sim, label in top_k_neighbors:
                    if label in candidates:
                        predicted_label = label
                        break
            else:
                predicted_label = candidates[0]
            
            predictions.append(predicted_label)
        
        return predictions[0] if single else predictions
    
    def predict_proba(self, X):
      
        if not self.train_vectors:
            raise ValueError("Model belum dilatih!")
        single = not isinstance(X, list)
        if single:
            X = [X]
        all_probs = []
        for vec in X:
            similarities = self._hitung_jarak(vec)
            similarities.sort(key=lambda x: x[0], reverse=True)
            
            top_k_neighbors = similarities[:self.k]
            
            votes = Counter([label for _, label in top_k_neighbors])
            
            probabilities = {label: count / self.k for label, count in votes.items()}
            
            all_probs.append(probabilities)
        
        return all_probs[0] if single else all_probs
    
    def _hitung_jarak(self, test_vec):
       
        distances = []
        for train_vec, label in zip(self.train_vectors, self.train_labels):
            similarity = self._cosine_similarity(test_vec, train_vec)
            distances.append((similarity, label))
        return distances
    
    def _cosine_similarity(self, vec1, vec2):
        
        common_keys = set(vec1.keys()) & set(vec2.keys())
        dot = sum(vec1[k] * vec2[k] for k in common_keys)
        
        norm1 = math.sqrt(sum(v ** 2 for v in vec1.values()))
        
        norm2 = math.sqrt(sum(v ** 2 for v in vec2.values()))
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return dot / (norm1 * norm2)
    
    def evaluate(self, X_test, y_test, verbose=True):
       
        if verbose:
            print(f"\n Mengevaluasi {len(X_test)} data test...")
        
        y_pred = self.predict(X_test)
        
        valid_true = [x for x in y_test if x is not None]
        valid_pred = [x for x in y_pred if x is not None]
        classes = sorted(list(set(valid_true) | set(valid_pred)))
        
        n = len(classes)
        matrix = np.zeros((n, n), dtype=int)
        label_to_index = {label: idx for idx, label in enumerate(classes)}
        
        for t, p in zip(y_test, y_pred):
            i = label_to_index[t]
            j = label_to_index[p]
            matrix[i][j] += 1
        
        total = matrix.sum()
        correct = np.trace(matrix)
        accuracy = correct / total if total > 0 else 0
        
        precision, recall, f1 = [], [], []
        for i in range(n):
            tp = matrix[i, i]
            fp = matrix[:, i].sum() - tp
            fn = matrix[i, :].sum() - tp
            
            prec = tp / (tp + fp) if (tp + fp) > 0 else 0
            rec = tp / (tp + fn) if (tp + fn) > 0 else 0
            f1_score = (2 * prec * rec) / (prec + rec) if (prec + rec) > 0 else 0
            
            precision.append(prec)
            recall.append(rec)
            f1.append(f1_score)
        
        avg_precision = float(np.mean(precision))
        avg_recall = float(np.mean(recall))
        avg_f1 = float(np.mean(f1))
        
        if verbose:
            print(f"\n📊 Hasil Evaluasi KNN (k={self.k}):")
            print(f"   Accuracy: {accuracy*100:.2f}%")
            print(f"   Macro Precision: {avg_precision*100:.2f}%")
            print(f"   Macro Recall: {avg_recall*100:.2f}%")
            print(f"   Macro F1-Score: {avg_f1*100:.2f}%")
        
        return {
            "confusion_matrix": matrix.tolist(),
            "classes": classes,
            "accuracy": float(accuracy),
            "precision": [float(p) for p in precision],
            "recall": [float(r) for r in recall],
            "f1_score": [float(f) for f in f1],
            "macro_precision": avg_precision,
            "macro_recall": avg_recall,
            "macro_f1": avg_f1,
        }
    
    def save_model(self, path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "wb") as f:
            pickle.dump(self, f)
        print(f" Model KNN disimpan ke: {path}")
    
    @staticmethod
    def load_model(path):
        if not os.path.exists(path):
            raise FileNotFoundError(f"Model file '{path}' tidak ditemukan.")
        with open(path, "rb") as f:
            model = pickle.load(f)
        print(f" Model KNN dimuat dari: {path}")
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
        print("\n Informasi Model KNN:")
        print(f"   Parameter K: {self.k}")
        print(f"   Total data training: {len(self.train_vectors)}")
        print(f"   Metrik similarity: Cosine Similarity")
        
        if self.train_labels:
            label_counts = Counter(self.train_labels)
            print(f"\n   Distribusi kelas:")
            for label, count in label_counts.items():
                print(f"      {label}: {count} dokumen ({count/len(self.train_labels)*100:.1f}%)")