from flask import Blueprint, request, render_template, redirect, url_for, flash
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash

from app import db
from app.models import User, College, UserCollegeJoin
from app.email_helper import send_email
from app.token_helper import generate_confirmation_token, confirm_token

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

    # New user, register them
    if not user:
        new_user = User(
            zid=zid, 
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
        
        db.session.add(new_user)
        db.session.commit()
        
    token = generate_confirmation_token(zid)
    loginurl = url_for('auth.login_otp_token', token=token, _external=True)
    try:
        send_email(f'z{zid}@unsw.edu.au', "Confirm your UNSW email", render_template('email/otp.html', otp_url=loginurl))
    except:
        flash('Failed to send email. Please contact support and try again later.')
        return redirect(url_for('auth.login'))

    return redirect(url_for('auth.otp_sent'))

@auth.route('/login/<token>')
def login_otp_token(token):
    try:
        zid = confirm_token(token)
    except:
        flash('The confirmation link is invalid or has expired.', 'danger')
        return redirect(url_for('auth.login'))
    if not zid:
        flash('The confirmation link is invalid or has expired.', 'danger')
        return redirect(url_for('auth.login'))
    
    user = User.query.filter_by(zid=zid).first_or_404()
    if not user:
        flash('Account creation failed, please try registering again.', 'danger')
        return redirect(url_for('auth.login'))
    else:
        if not user.confirmed:
            user.confirmed = True
            db.session.add(user)
            db.session.commit()
            # flash('You have confirmed your account. Thanks!', 'success')
        login_user(user)
        return redirect(url_for('main.home'))

@auth.route('/otp_sent')
def otp_sent():
    return render_template('otp_sent.html')

@auth.route('/logout')
def logout():
    if current_user and current_user.is_authenticated:
        logout_user()
    else:
        flash('Already logged out.', 'success')
    return redirect(url_for('auth.login'))
