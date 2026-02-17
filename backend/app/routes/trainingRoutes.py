
from flask import Blueprint, request, jsonify
from app.controllers.traningController import TrainingController

training_bp = Blueprint('training_bp', __name__)
controller = TrainingController()

@training_bp.route('', methods=['POST'])
def train_model():
    req = request.get_json()
    rasio = req.get("rasio")
    return controller.train_model(rasio)

@training_bp.route('/predict', methods=['POST'])
def predict_message():
    req = request.get_json()
    user_input = req.get("text", "").strip()
    return controller.predict_message(user_input)


@training_bp.route('/knn', methods=['POST'])
def train_knn():
    req = request.get_json()
    rasio = req.get("rasio")
    k = req.get("k_val")
    return controller.train_model_knn(rasio, k)

@training_bp.route('/knn/predict', methods=['POST'])
def predict_knn():
    req = request.get_json()
    user_input = req.get("text", "").strip()
    return controller.predict_message_knn(user_input)