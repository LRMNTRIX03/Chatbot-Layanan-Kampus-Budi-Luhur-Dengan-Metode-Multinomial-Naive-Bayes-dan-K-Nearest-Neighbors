from app.controllers.authController import AuthController
from flask import Blueprint, request
from flask_login import login_required

auth_bp = Blueprint("auth_bp", __name__)
auth_controller = AuthController()

@auth_bp.route("/login", methods=["POST"])
def authenticate():
    data = request.get_json()
    return auth_controller.login(data)

@auth_bp.route("/logout", methods=["POST"])
def deleteSession():
    return auth_controller.logout()

@auth_bp.route("/check", methods=["GET"])
@login_required
def checkLogin():
    return auth_controller.check()

@auth_bp.route("/register", methods=["POST"])
def regAuth():
    data = request.get_json()
    return auth_controller.register(data)


