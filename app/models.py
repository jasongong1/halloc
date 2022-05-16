from dataclasses import dataclass
from flask_login import UserMixin
from sqlalchemy import DDL, event
from app import db

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    zid = db.Column(db.Integer, primary_key=True)
    # email = db.Column(db.String, unique=True)
    hash = db.Column(db.String)
    username = db.Column(db.String)
    confirmed = db.Column(db.Boolean, nullable=False, default=False)
    admin = db.Column(db.Boolean, nullable=False, default=False)

    wam = db.Column(db.Float, default=0.0)
    room_points = db.Column(db.Float, default=0.0)

    preferences = db.relationship('Preference', backref='user', lazy=True)

    def get_id(self):
           return (self.zid)

class College(db.Model):
    __tablename__ = 'colleges'
    id = db.Column(db.Integer, primary_key=True)
    college_name = db.Column(db.String)
    # rooms = db.relationship('Room', backref='college_room', lazy=True)
    # floors = db.relationship('Floor', backref='college_floor', lazy=True)


class Floor(db.Model):
    __tablename__ = 'floors'
    id = db.Column(db.Integer, primary_key=True)
    floor_level = db.Column(db.String)
    # rooms = db.relationship('Room', backref='floor_room', lazy=True)

    college_id = db.Column(db.Integer, db.ForeignKey('colleges.id'),
        nullable=False)
    college=db.relationship('College', backref='floor_college', lazy='joined', innerjoin=True)

class UserCollegeJoin(db.Model):
    __tablename__ = 'user_college_join'
    id = db.Column(db.Integer, primary_key=True)
    user_zid = db.Column(db.Integer, db.ForeignKey('users.zid'), nullable=False)
    college_id = db.Column(db.Integer, db.ForeignKey('colleges.id'), nullable=False)

@dataclass
class Room(db.Model):
    id: int
    room_name: str
    room_type: str
    selectable: bool
    college_id: int
    floor_id: int

    __tablename__ = 'rooms'
    id = db.Column(db.Integer, primary_key=True)
    room_name = db.Column(db.String, nullable=False)
    room_type = db.Column(db.String)
    selectable = db.Column(db.Boolean, nullable=False, default=False)
    # preferences = db.relationship('Preference', backref='room', lazy=True)
    
    college_id = db.Column(db.Integer, db.ForeignKey('colleges.id'),
        nullable=False)
    floor_id = db.Column(db.Integer, db.ForeignKey('floors.id'),
        nullable=False)

    floor=db.relationship('Floor', backref='room', lazy='joined', innerjoin=True)
    

@dataclass
class Preference(db.Model):
    id: int
    user_zid: int
    rank: int
    room_id: int
    room: dict

    __tablename__ = 'preferences'
    id = db.Column(db.Integer, primary_key=True)
    user_zid = db.Column(db.Integer)
    rank = db.Column(db.Integer)
    room_id=db.Column(db.Integer, db.ForeignKey('rooms.id'),
        nullable=False)
    user_zid = db.Column(db.Integer, db.ForeignKey('users.zid'),
        nullable=False)
    room=db.relationship('Room', backref='preference', lazy='joined', innerjoin=True)

preference_decrement_rank_trigger = DDL('''\
CREATE TRIGGER preferences__decrement_rank_after_deletion
AFTER DELETE ON preferences
FOR EACH ROW
BEGIN
    UPDATE preferences
    SET rank = rank - 1
    WHERE user_zid = OLD.user_zid
    AND rank > OLD.rank;
END;''')
event.listen(Preference.__table__, 'after_create', preference_decrement_rank_trigger)

preference_increment_rank_trigger = DDL('''\
CREATE TRIGGER preferences__increment_rank_before_insertion
BEFORE INSERT ON preferences
FOR EACH ROW
BEGIN
    UPDATE preferences
    SET rank = rank + 1
    WHERE user_zid = NEW.user_zid
    AND rank >= NEW.rank;
END;''')
event.listen(Preference.__table__, 'after_create', preference_increment_rank_trigger)
    