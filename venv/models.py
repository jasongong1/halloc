from flask_login import UserMixin
from . import db

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    zid = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True)
    hash = db.Column(db.String)
    username = db.Column(db.String)
    preferences = db.relationship('Preference', backref='user', lazy=True)
    
    def get_id(self):
           return (self.zid)

class College(db.Model):
    __tablename__ = 'colleges'
    id = db.Column(db.Integer, primary_key=True)
    college_name = db.Column(db.String)
    rooms = db.relationship('Room', backref='college', lazy=True)
    floors = db.relationship('Floor', backref='college', lazy=True)


class Floor(db.Model):
    __tablename__ = 'floors'
    id = db.Column(db.Integer, primary_key=True)
    floor_level = db.Column(db.String)
    rooms = db.relationship('Room', backref='floor', lazy=True)
    college_id = db.Column(db.Integer, db.ForeignKey('colleges.id'),
        nullable=False)

class Room(db.Model):
    __tablename__ = 'rooms'
    id = db.Column(db.Integer, primary_key=True)
    room_name = db.Column(db.String, nullable=False)
    room_type = db.Column(db.String)
    preferences = db.relationship('Preference', backref='room', lazy=True)
    
    college_id = db.Column(db.Integer, db.ForeignKey('colleges.id'),
        nullable=False)
    floor_id = db.Column(db.Integer, db.ForeignKey('floors.id'),
        nullable=False)

class Preference(db.Model):
    __tablename__ = 'preferences'
    id = db.Column(db.Integer, primary_key=True)
    user_zid = db.Column(db.Integer)
    rank = db.Column(db.Integer)
    room_id=db.Column(db.Integer, db.ForeignKey('rooms.id'),
        nullable=False)
    user_zid = db.Column(db.Integer, db.ForeignKey('users.zid'),
        nullable=False)
        

