import pandas as pd
from collections import Counter
import re

class WordsBuilder:
      def build_kampus_words_from_csv(self,
        csv_path,
        pattern_column="text",
        min_freq=2
    ):
        
        df = pd.read_csv(csv_path)

        if pattern_column not in df.columns:
            raise ValueError(f"Kolom '{pattern_column}' tidak ditemukan di CSV")

        all_words = ["s1", "s2", "s3"]

        for text in df[pattern_column].dropna():
            text = str(text).lower()
            tokens = re.findall(r'\b[a-zA-Z]{3,}\b', text)
            all_words.extend(tokens)

        counter = Counter(all_words)
        kampus_words = [
            word for word, freq in counter.items()
            if freq >= min_freq
        ]
        print(f"text : {kampus_words}")
        return sorted(set(kampus_words))
