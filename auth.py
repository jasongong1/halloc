import re
from flask import Blueprint, request, render_template, redirect, url_for, flash
from flask_login import login_user, logout_user, login_required, current_user
from . import db
from werkzeug.security import generate_password_hash, check_password_hash
from .models import User, College, UserCollegeJoin

auth = Blueprint('auth', __name__)

@auth.route('/login')
def login():
    if current_user and current_user.is_authenticated:
        flash('You are already logged in.', 'primary')
        return redirect(url_for('main.home'))
    return render_template("login.html")

@auth.route('/login', methods=['POST'])
def login_post():
    # login code goes here
    zid = request.form.get('zid')
    password = request.form.get('password')

    if not (zid and password):
        flash('Please check your login details and try again.', 'warning')
        return redirect(url_for('auth.login'))

    remember = True if request.form.get('remember') else False

    user = User.query.filter_by(zid=zid).first()

    # check if the user actually exists
    # take the user-supplied password, hash it, and compare it to the hashed password in the database
    if not user or not check_password_hash(user.hash, password):
        flash('Please check your login details and try again.', 'warning')
        return redirect(url_for('auth.login'))

    login_user(user, remember=remember)
    return redirect(url_for('main.home'))

@auth.route('/register')
def register():
    return render_template("register.html")

@auth.route('/register', methods=['POST'])
def register_post():
    zid = request.form.get('zid')
    password = request.form.get('password')
    email = request.form.get('email')
    remember = True if request.form.get('remember') else False

    user = User.query.filter_by(zid=zid).first()

    if user:
        flash('user already exists', 'warning')
        return redirect(url_for('auth.register'))

    new_user = User(
        zid=zid, 
        email=f"z{zid}@unsw.edu.au" if not email else email,
        hash=generate_password_hash(password, method='sha256')
    )
    
    # GIVES PERMS FOR ALL USERS TO ACCESS ALL COLLEGES FOR DEMO ONLY
    colleges = College.query.all()
    for college in colleges:
        new_user_college_join = UserCollegeJoin(
            user_zid=zid,
            college_id=college.id
        )
        db.session.add(new_user_college_join)
    # END

    db.session.add(new_user)
    db.session.commit()

    login_user(new_user, remember=remember)
    
    return redirect(url_for('main.home'))

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))