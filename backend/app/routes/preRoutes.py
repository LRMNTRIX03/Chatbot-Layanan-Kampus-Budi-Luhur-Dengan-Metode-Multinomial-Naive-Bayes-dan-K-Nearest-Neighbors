from flask import Blueprint, request, jsonify
from app.controllers.preprocessingController import PreprocessingController
from flask_login import login_required
from app.middleware.auth_middleware import admin_handler
from app.models.patternModel import PatternModel
from app.models.responseModel import ResponseModel

preprocessing_bp = Blueprint("preprocessing_bp", __name__)

preprocessing_controller = PreprocessingController()

@preprocessing_bp.route("", methods=["POST"])
# @login_required
# @admin_handler
def preprocessing():
    return preprocessing_controller.preprocessing()
@preprocessing_bp.route("", methods=["GET"])
# @login_required
# @admin_handler
def get_data():
    return preprocessing_controller.get_data()
