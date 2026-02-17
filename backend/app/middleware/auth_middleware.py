from flask import jsonify
from flask_login import current_user
from functools import wraps

def admin_handler(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if not current_user.is_authenticated:
            return jsonify({"message": "Unauthorized"}), 401
        if getattr(current_user, "role", None) != "admin":
            return jsonify({"message": "Forbidden: Admins only"}), 403
        return fn(*args, **kwargs)
    return wrapper
