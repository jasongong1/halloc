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

    # check if the user actually exists
    # take the user-supplied password, hash it, and compare it to the hashed password in the database
    if not user or not check_password_hash(user.hash, password):
        flash('Please check your login details and try again.', 'warning')
        return redirect(url_for('auth.login'))

    # check if user has been authenticated
    if not user.confirmed:
        flash('Please confirm your UNSW email address', 'warning')

        token = generate_confirmation_token(zid)
        confirm_url = url_for('auth.confirm_email', token=token, _external=True)
        try:
            send_email(f'z{zid}@unsw.edu.au', "Confirm your UNSW email", render_template('confirm_email.html', confirm_url=confirm_url))
        except:
            flash('Failed to send email. Please contact support and try again later.')
            return redirect(url_for('auth.register'))

        return redirect(url_for('auth.confirm_message'))

    login_user(user, remember=remember)
    return redirect(url_for('main.home'))

@auth.route('/register')
def register():
    return render_template("register.html")

@auth.route('/register', methods=['POST'])
def register_post():
    zid = request.form.get('zid')
    password = request.form.get('password')
    # email = request.form.get('email')

    user = User.query.filter_by(zid=zid).first()

    if user:
        flash('user already exists', 'warning')
        return redirect(url_for('auth.register'))

    # unsw_email_address = f"z{zid}@unsw.edu.au"

    new_user = User(
        zid=zid, 
        # email=unsw_email_address if not email else email,
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

    token = generate_confirmation_token(zid)

    confirm_url = url_for('auth.confirm_email', token=token, _external=True)
    try:
        send_email(f"z{zid}@unsw.edu.au", "Confirm your UNSW email", render_template('confirm_email.html', confirm_url=confirm_url))
    except:
        flash('Failed to send email, account not registered. Please contact support and try again later.')
        return redirect(url_for('auth.register'))

    flash('A confirmation link has been sent via email.', 'success')
    
    db.session.add(new_user)
    db.session.commit()
    
    return redirect(url_for('auth.confirm_message'))

@auth.route('/confirm/<token>')
def confirm_email(token):
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
        flash('Account creation failed, please try again.', 'danger')
        return redirect(url_for('auth.register'))
    if user.confirmed:
        flash('Account already confirmed. Please login.', 'success')
        return redirect(url_for('auth.login'))
    else:
        user.confirmed = True
        db.session.add(user)
        db.session.commit()
        flash('You have confirmed your account. Thanks!', 'success')
        login_user(user)
        return redirect(url_for('main.home'))

@auth.route('/confirm_message')
def confirm_message():
    return render_template('verification_confirm.html')

@auth.route('/passwordreset/<token>')
def password_reset(token):
    try:
        zid = confirm_token(token)
    except:
        flash('The confirmation link is invalid or has expired.', 'danger')
        return redirect(url_for('auth.login'))

@auth.route('/logout')
def logout():
    if current_user and current_user.is_authenticated:
        logout_user()
    else:
        flash('Already logged out.', 'success')
    return redirect(url_for('auth.login'))
