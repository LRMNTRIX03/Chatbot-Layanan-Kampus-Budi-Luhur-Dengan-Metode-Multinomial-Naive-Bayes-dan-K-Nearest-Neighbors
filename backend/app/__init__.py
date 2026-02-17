from flask import Flask
from .config import Config
from .models import *
from .extensions import db, migrate, bcrypt, login_manager
# from .routes.auth_routes import auth_bp
from .routes.intentRoutes import intent_bp
from .routes.patternRoutes import pattern_bp
from .routes.responseRoutes import response_bp
from .routes.preRoutes import preprocessing_bp
from .routes.trainingRoutes import training_bp
from .routes.authRoutes import auth_bp
from .routes.stopwordRoutes import stopwords_bp
from .routes.tfidfRoutes import tfidf_bp
from .routes.slangwordsRoutes import slangwords_bp
from .routes.riwayatRoutes import riwayat_bp
from flask_cors import CORS
from flask_session import Session

def create_app():
    app = Flask(__name__)
    

    app.config.from_object(Config)
    CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "http://localhost:5173"}})
    

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    # login_manager.login_view = "auth_bp.login"
    
    @login_manager.user_loader
    def load_user(user_id):
        return UserModel.query.get(int(user_id))
    
    #Session
    Session(app)

    app.register_blueprint(intent_bp, url_prefix="/api/intent")
    app.register_blueprint(pattern_bp, url_prefix="/api/pattern")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(response_bp, url_prefix="/api/response")
    app.register_blueprint(preprocessing_bp, url_prefix="/api/pre")
    app.register_blueprint(training_bp, url_prefix="/api/training")
    app.register_blueprint(stopwords_bp, url_prefix="/api/stopword")
    app.register_blueprint(tfidf_bp, url_prefix="/api/tfidf")
    app.register_blueprint(slangwords_bp, url_prefix="/api/slangwords")
    app.register_blueprint(riwayat_bp, url_prefix="/api/riwayat")

    return app
