from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_mail import Mail
from project.secret import secret_key, security_password_salt
import os

db = SQLAlchemy()
mail = Mail()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)

    app.config['MAIL_SERVER'] = 'smtp-mail.outlook.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False

    app.config['MAIL_USERNAME'] = os.environ['APP_MAIL_USERNAME']
    app.config['MAIL_PASSWORD'] = os.environ['APP_MAIL_PASSWORD']

    app.config['MAIL_DEFAULT_SENDER'] = os.environ['APP_MAIL_USERNAME']


    app.config['SECRET_KEY'] = secret_key
    app.config['SECURITY_PASSWORD_SALT'] = security_password_salt
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///rooms.db'

    # initialize plugins
    mail.init_app(app)
    db.init_app(app)

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
