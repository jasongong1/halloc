from flask import Blueprint, render_template, redirect, url_for
from flask_login import login_required, current_user
from . import db
from .models import Preference, Room

main = Blueprint('main', __name__)

@main.route('/home')
@login_required
def home():
    # preferences = Room.query.join(Preference, Room.id==Preference.room_id).filter_by(user_zid=current_user.zid).all()
    # print(list(map(lambda i : i.rank, preferences)))
    # print(list(map(lambda i : i.rank, Preference.query.all())))
    preferences = Preference.query.filter_by(user_zid=current_user.zid).all()
    return render_template("index.html", preferences=preferences)

@main.route('/')
def index():
    return redirect(url_for('auth.login'))

@main.route('/delete_preference', methods=['DELETE'])
@login_required
def delete_preference():
    rooms = Room.query.join(Preference).filter_by(user_zid=current_user.zid).all()
