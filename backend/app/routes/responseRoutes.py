from flask import Blueprint, request
from app.controllers.responseController import ResponseController
from app.middleware.auth_middleware import  admin_handler
from flask_login import login_required

response_bp = Blueprint("response_bp", __name__)

response_controller = ResponseController()


@response_bp.route("", methods=["GET"])
@admin_handler
@login_required
def getall():
    return response_controller.getall()

@response_bp.route("", methods=["POST"])
@admin_handler
@login_required
def create():
    data = request.get_json()
    return response_controller.create(data)

@response_bp.route("/<id>", methods=["PUT"])
@admin_handler
@login_required
def update(id):
    data = request.get_json()
    return response_controller.update(data, id)

@response_bp.route("/<id>", methods=["DELETE"])
@admin_handler
@login_required
def delete(id):
    return response_controller.delete(id)

@response_bp.route("/<id>", methods=["GET"])
@admin_handler
@login_required
def get_by_id(id):
    return response_controller.get_by_id(id)

@response_bp.route('/upload', methods=['POST'])
@login_required
@admin_handler
def create_from_file():
    file = request.files['file']
    return response_controller.upload(file)

