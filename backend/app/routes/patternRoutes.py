from app.controllers.patternController import PatternController
from flask import Blueprint, request
from app.middleware.auth_middleware import  admin_handler
from flask_login import login_required
pattern_controller = PatternController()

pattern_bp = Blueprint("pattern_bp", __name__)

@pattern_bp.route("", methods=["POST"])
@login_required
@admin_handler
def create():
    data = request.get_json()
    return pattern_controller.create(data)


@pattern_bp.route("", methods=["GET"])
@login_required
@admin_handler
def fetchall():
    data = pattern_controller.getall()
    return data

@pattern_bp.route("/<id>", methods=["GET"])    
@login_required
@admin_handler
def fetch_by_id(id):
    data = pattern_controller.getById(id)
    return data

@pattern_bp.route("/<id>", methods=["PUT"])
@login_required
@admin_handler
def update(id):
    data = request.get_json()
    return pattern_controller.update(data, id)

@pattern_bp.route("/<id>", methods=["DELETE"])
@login_required
@admin_handler
def delete(id):
    return pattern_controller.delete(id)

@pattern_bp.route('/upload', methods=['POST'])
@login_required
@admin_handler
def create_from_file():
    file = request.files['file']
    return pattern_controller.upload(file)

