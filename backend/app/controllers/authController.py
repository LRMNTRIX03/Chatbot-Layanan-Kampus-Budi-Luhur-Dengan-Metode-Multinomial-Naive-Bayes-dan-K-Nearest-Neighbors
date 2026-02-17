from flask import  jsonify, session, make_response
from flask_login import login_user, logout_user, current_user, login_required
from app.models.userModel import UserModel
from app.extensions import db, bcrypt



class AuthController:
    def login(self, data):
        if not data.get("username") or not data.get("password"):
            return jsonify({"error": "Username or password is missing"}), 400

        username = data["username"]
        password = data["password"]
        user = UserModel.query.filter_by(username=username).first()

        if not user:
            return jsonify({"error": "Username atau Password anda Salah"}), 404

        if not bcrypt.check_password_hash(user.password, password):
            return jsonify({"error": "Password salah"}), 401

        login_user(user, remember=True)
        session["role"] = user.role

        print("session after login : ", dict(session))
        print("User logged in:", current_user.is_authenticated, current_user.get_id())

        print("user to dict:", user.to_dict())
        return jsonify({
            "message": "Login successful",
            "user": user.to_dict()
        }), 200
            
    def logout(self):
        logout_user()
        session.clear()
        session.permanent = False

        response = make_response(jsonify({"message": "Logout successful"}), 200)
        response.set_cookie('session', '', expires=0) 
        response.set_cookie('remember_token', '', expires=0)  
        print("session after logout:", dict(session))
        return response
        
    
    def check(self):
        if not current_user.is_authenticated:
            return jsonify({"logged_in": False}), 401

        return jsonify({
            "logged_in": True,
            "user": {
                "id": current_user.id,
                "username": current_user.username,
                "role": session.get("role"),
                "name": current_user.name
            }
        }), 200

    def register(self, data):
        if not data.get("username") or not data.get("password"):
            return jsonify({"error": "Data is missing"}), 400

        username = data["username"]
        password = data["password"]
        name = data["name"]
        role = data.get("role", None)

        existing_user = UserModel.query.filter_by(username=username).first()
        if existing_user:
            return jsonify({"error": "Username sudah digunakan"}), 400

        password_hash = bcrypt.generate_password_hash(password).decode("utf-8")


        user = UserModel(username=username, password=password_hash, role=role, name=name)

        db.session.add(user)
        db.session.commit()

        return jsonify({"message": "User berhasil dibuat"}), 201