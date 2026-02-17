from app.controllers.intentController import IntentController
from flask import Blueprint, request
from app.middleware.auth_middleware import  admin_handler
from flask_login import login_required

intent_controller = IntentController()

intent_bp = Blueprint("intent_bp", __name__)

@intent_bp.route('', methods=['POST'])
@login_required
@admin_handler
def create():
    data = request.get_json()
    return intent_controller.create(data)

@intent_bp.route('', methods=['GET'])
@admin_handler
@login_required
def get_all():
    return intent_controller.get_all()

@intent_bp.route('/<id>', methods=['GET'])
@login_required
@admin_handler
def get_by_id(id):
    return intent_controller.get_by_id(id)

@intent_bp.route('/<id>', methods=['PUT'])
@login_required
@admin_handler
def update(id):
    data = request.get_json()
    return intent_controller.update(data, id)

@intent_bp.route('/<id>', methods=['DELETE'])
@login_required
@admin_handler
def delete(id):
    return intent_controller.delete(id)

@intent_bp.route('/upload', methods=['POST'])
@login_required
@admin_handler
def create_from_file():
    file = request.files['file']
    return intent_controller.upload(file)

