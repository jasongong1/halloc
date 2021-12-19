from flask import Blueprint, render_template, redirect, url_for
from flask_login import login_required, current_user
from . import db
from .models import Preference, Room

main = Blueprint('main', __name__)

@main.route('/home')
@login_required
def home():
    rooms = Room.query.join(Preference).filter_by(user_zid=current_user.zid).all()
    return render_template("index.html", preferences=rooms)

@main.route('/')
def index():
    return redirect(url_for('auth.login'))
