from flask import Blueprint, json, render_template, redirect, url_for, request, jsonify
from flask_login import login_required, current_user
from sqlalchemy.orm import query
from . import db
from .models import Preference, Room, College, Floor, UserCollegeJoin

main = Blueprint('main', __name__)

@main.route('/home')
@login_required
def home():
    preferences = Preference.query.filter_by(user_zid=current_user.zid).order_by(Preference.rank).all()
    preferences_list = [{
        'rank': p.rank,
        'room_name': p.room.room_name,
        'floor_level': p.room.floor.floor_level,
        'college_name': p.room.floor.college.college_name
    } for p in preferences]
    colleges = College.query.join(UserCollegeJoin, College.id == UserCollegeJoin.college_id).filter(UserCollegeJoin.user_zid==current_user.zid).order_by(UserCollegeJoin.college_id).all()
    colleges_list = [
        {   
            "college_id": c.id,
            "college_name": c.college_name,
            "college_floors": [{
                'floor_level': floor.__dict__['floor_level'],
                'college_id': floor.__dict__['college_id'],
                'id': floor.__dict__['id']
            } for floor in Floor.query.filter_by(college_id=c.id).order_by(Floor.floor_level).all()]
        } for c in colleges]
    return render_template("index.html", preferences=preferences_list, colleges=colleges_list)

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
        return jsonify(success=True)
    return jsonify(success=False)

@main.route('/insert_preference', methods=['POST'])
@login_required
def insert_preference():
    req_json = request.get_json()

    found_room_id = Room.query.filter_by(room_name=req_json['room_name'].strip()).first()
        
    # if the room name is valid and not already preferenced by this user:
    if found_room_id:
        found_room_id = found_room_id.id
        existing_preference = Preference.query.filter(Preference.room_id==found_room_id, Preference.user_zid==current_user.zid).first()
        if existing_preference:
            db.session.delete(existing_preference)
        db.session.add(Preference(
            user_zid=current_user.zid,
            room_id=found_room_id,
            rank=int(req_json['rank'])
        ))
        db.session.commit()
        print(f"inserted room name {req_json['room_name'].strip()} in rank {int(req_json['rank'])}")
        return jsonify(success=True)
    return jsonify(success=False)

@main.route('/get_updated_table')
@login_required
def get_updated_table():
    preferences = Preference.query.filter_by(user_zid=current_user.zid).order_by(Preference.rank).all()
    preferences_list = [{
        'rank': p.rank,
        'room_name': p.room.room_name,
        'floor_level': p.room.floor.floor_level,
        'college_name': p.room.floor.college.college_name
    } for p in preferences]
    return jsonify({
        'preference_list': preferences_list
    })

@main.route('/delete_all_preferences', methods=['DELETE'])
@login_required
def delete_all_preferences():
    Preference.query.filter_by(user_zid=current_user.zid).delete();
    db.session.commit()
    return jsonify(success=True)