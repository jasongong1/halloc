from flask import Blueprint, render_template, redirect, url_for, request, jsonify
from flask_login import login_required, current_user
from . import db
from .models import Preference, Room

main = Blueprint('main', __name__)

@main.route('/home')
@login_required
def home():
    preferences = Preference.query.filter_by(user_zid=current_user.zid).order_by(Preference.rank).all()
    return render_template("index.html", preferences=preferences)

@main.route('/')
def index():
    return redirect(url_for('auth.login'))

@main.route('/delete_preference', methods=['DELETE'])
@login_required
def delete_preference():
    req_json = request.get_json()
    to_delete = Preference.query.join(Room, Preference.room_id==Room.id).filter(
        Room.room_name==req_json['room_name'].strip(),
        Preference.user_zid==current_user.zid,
        Preference.rank==req_json['rank'].strip(),
        ).first()
    if (to_delete):
        db.session.delete(to_delete)
        db.session.commit()
        print(f"deleted room name {req_json['room_name'].strip()} in rank {req_json['rank'].strip()}")
    return ('', 204)

@main.route('/insert_preference', methods=['POST'])
@login_required
def insert_preference():
    req_json = request.get_json()

    found_room_id = Room.query.filter_by(room_name=req_json['room_name'].strip()).first().id
    if (found_room_id):
        db.session.add(Preference(
            user_zid=current_user.zid,
            room_id=found_room_id,
            rank=int(req_json['rank'])
        ))
        db.session.commit()
        print(f"inserted room name {req_json['room_name'].strip()} in rank {int(req_json['rank'])}")
    return jsonify(success=True)
