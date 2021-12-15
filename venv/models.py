from flask_login import UserMixin
from . import db

class users(UserMixin, db.Model):
    zid = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True)
    hash = db.Column(db.String)
    username = db.Column(db.String)
    
    def get_id(self):
           return (self.zid)
