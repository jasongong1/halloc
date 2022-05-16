from flask import Flask
from flask_login import LoginManager
from flask_mail import Mail
from dotenv import load_dotenv
import os

from flask_sqlalchemy import SQLAlchemy

mail = Mail()
login_manager = LoginManager()
db = SQLAlchemy()

from app import models

def create_app():

    load_dotenv()

    app = Flask(__name__)

    # MAIL SETTINGS
        # OUTLOOK
            # MAIL_SERVER = smtp-mail.outlook.com
            # MAIL_PORT = 587
        # GMAIL
            # MAIL_SERVER = smtp.gmail.com
            # MAIL_PORT = 465

    app.config['MAIL_SERVER'] = 'smtp-mail.outlook.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False

    app.config['MAIL_USERNAME'] = os.environ['APP_MAIL_USERNAME']
    app.config['MAIL_PASSWORD'] = os.environ['APP_MAIL_PASSWORD']

    app.config['MAIL_DEFAULT_SENDER'] = os.environ['APP_MAIL_USERNAME']

    app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
    app.config['SECURITY_PASSWORD_SALT'] = os.environ['SECURITY_PASSWORD_SALT']
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///rooms.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # initialize plugins
    db.init_app(app)
    
    with app.app_context():
        db.create_all()

    mail.init_app(app)

    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    from .models import User

    @login_manager.user_loader
    def load_user(zid):
        return User.query.get(int(zid))

    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app
