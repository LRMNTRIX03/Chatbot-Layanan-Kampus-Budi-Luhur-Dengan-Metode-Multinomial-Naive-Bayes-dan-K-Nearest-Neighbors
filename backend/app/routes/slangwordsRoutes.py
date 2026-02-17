from flask import Blueprint, request
from app.controllers.slangwordsController import SlangwordsController
from app.middleware.auth_middleware import admin_handler
from flask_login import login_required

slangwords_bp = Blueprint("slangwords_bp", __name__)

slangwords_controller = SlangwordsController()

@slangwords_bp.route("", methods=["GET"])
@admin_handler
@login_required
def getall():
    return slangwords_controller.get_all_slangwords()

@slangwords_bp.route("/<id>", methods=["GET"])
@admin_handler
@login_required
def get_by_id(id):
    return slangwords_controller.get_by_id_slangwords(id)

@slangwords_bp.route("", methods=["POST"])
@admin_handler
@login_required
def create():
    data = request.get_json()
    return slangwords_controller.create_slangwords(data)

@slangwords_bp.route("/<id>", methods=["PUT"])
@admin_handler
@login_required
def update(id):
    data = request.get_json()
    return slangwords_controller.update_slangwords(data, id)

@slangwords_bp.route("/<id>", methods=["DELETE"])
@admin_handler
@login_required
def delete(id):
    return slangwords_controller.delete_slangwords(id)