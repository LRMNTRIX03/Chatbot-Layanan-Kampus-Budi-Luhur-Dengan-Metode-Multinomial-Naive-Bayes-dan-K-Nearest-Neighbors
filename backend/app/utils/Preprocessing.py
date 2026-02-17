import re
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory
from nltk.stem import PorterStemmer
from app.extensions import db
from app.models.stopwordsModel import StopwordsModel
from app.models.slangwordsModel import SlangwordsModel

class Preprocessing:
    def __init__(self):
        self.stemmer = StemmerFactory().create_stemmer()
        self.stopword_remover = StopWordRemoverFactory().create_stop_word_remover()
        self.stemmer_english = PorterStemmer()
        self.stopwords = set()
        self.slangwords_dict = None


    def case_folding(self, text):
        return text.lower()


    def clean_text(self, text):
        text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
        text = re.sub(r'\d+', ' ', text)
        text = re.sub(r'[\U0001F600-\U0001F64F]', '', text)
        text = re.sub(r'\s+', ' ', text).strip()

        return text


    def slangwords_replacement(self, text):
        slangwords_db = SlangwordsModel.query.all()
        self.slangwords_dict = {
                x.kata_tbaku.lower(): x.kata_baku.lower() 
                for x in slangwords_db
            }

        words = text.split()
        replaced = [self.slangwords_dict.get(w.lower(), w) for w in words]

        return " ".join(replaced)


    def tokenization(self, text):
        tokens = text.split()
        tokens = [t for t in tokens if len(t) > 2]
        return tokens


    def stopword_removal(self, tokens):
        stopwords_db = StopwordsModel.query.all()
        self.stopwords = {x.text.lower() for x in stopwords_db}
        result = []
        for w in tokens:
            lw = w.lower()
            if lw in self.stopwords:
                continue
            cleaned = self.stopword_remover.remove(lw)
            if cleaned and cleaned.strip():
                result.append(cleaned.strip())

        return " ".join(result)


    def stemming(self, text):
        if isinstance(text, list):
            text = " ".join(text)
        if not isinstance(text, str):
            text = str(text)
        stemmed = self.stemmer.stem(text)
        stemmed = re.sub(r'\s+', ' ', stemmed).strip()
        return stemmed


    def preprocessing(self, text):
        if text is None:
            text = ""
        elif not isinstance(text, str):
            text = str(text)

        text = self.clean_text(text)
        text = self.case_folding(text)
        text = self.slangwords_replacement(text)
        text = self.tokenization(text)
        text = self.stopword_removal(text)
        text = self.stemming(text)

        return text
