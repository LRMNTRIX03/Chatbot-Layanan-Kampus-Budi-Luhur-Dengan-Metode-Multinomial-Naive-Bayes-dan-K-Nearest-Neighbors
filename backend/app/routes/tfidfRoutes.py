from flask import Blueprint
from app.controllers.tfidfController import TFIDFController

tfidf_bp = Blueprint('tfidf', __name__)
tfidf_controller = TFIDFController()

# Route untuk MENGHITUNG TF-IDF (ini yang kurang!)
@tfidf_bp.route('/compute', methods=['POST'])
def compute_tfidf():
 
    return tfidf_controller.compute_and_save_tfidf()

# Route untuk mendapatkan statistik TF-IDF global
@tfidf_bp.route('/statistics', methods=['GET'])
def get_tfidf_statistics():
  
    return tfidf_controller.get_tfidf_statistics()
