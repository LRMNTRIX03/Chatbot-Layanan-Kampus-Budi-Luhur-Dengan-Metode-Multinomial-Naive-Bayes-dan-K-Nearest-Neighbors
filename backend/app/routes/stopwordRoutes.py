from flask import Blueprint, request
from app.controllers.stopwordsController import StopwordsController
from app.middleware.auth_middleware import  admin_handler
from flask_login import login_required

stopwords_bp = Blueprint("stopwords_bp", __name__)

stopwords_controller = StopwordsController()


@stopwords_bp.route("", methods=["GET"])
@admin_handler
@login_required
def getall():
    return stopwords_controller.getAll()

@stopwords_bp.route("", methods=["POST"])
@admin_handler
@login_required
def create():
    data = request.get_json()
    return stopwords_controller.create(data)

@stopwords_bp.route("/<id>", methods=["PUT"])
@admin_handler
@login_required
def update(id):
    data = request.get_json()
    return stopwords_controller.update(data, id)

@stopwords_bp.route("/<id>", methods=["DELETE"])
@admin_handler
@login_required
def delete(id):
    return stopwords_controller.delete(id)

@stopwords_bp.route("/<id>", methods=["GET"])
@admin_handler
@login_required
def get_by_id(id):
    return stopwords_controller.getById(id)

