import re
import smtplib
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db, bcrypt
from models import User
from email_service import (
    MAX_CODE_ATTEMPTS,
    can_send_code,
    code_expiry,
    generate_code,
    hash_code,
    send_code_email,
)

auth_bp = Blueprint("auth", __name__)
EMAIL_REGEX = r"^[\w\.-]+@[\w\.-]+\.\w+$"

def _send_verification_code(user):
    if not can_send_code(user.verification_sent_at):
        return "Please wait before requesting another code."
    code = generate_code()
    user.verification_code_hash = hash_code(code)
    user.verification_expires_at = code_expiry()
    user.verification_attempts = 0
    user.verification_sent_at = datetime.utcnow()
    send_code_email(user.email, code, "verification")
    db.session.commit()
    return None

@auth_bp.route("/signup-init", methods=["POST"])
def signup_init():
    """Step 1: Validate details and send OTP for registration."""
    data = request.get_json(silent=True) or {}
    name = data.get("name", "").strip()
    username = data.get("username", "").strip().lower()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not all([name, username, email, password]):
        return jsonify({"message": "All fields are required"}), 400

    if not re.match(EMAIL_REGEX, email):
        return jsonify({"message": "Please provide a valid email address"}), 400

    if len(username) < 3:
        return jsonify({"message": "Username must be at least 3 characters long"}), 400

    if len(password) < 6:
        return jsonify({"message": "Password must be at least 6 characters long"}), 400

    # Check if a VERIFIED user exists with this email
    existing_email = User.query.filter_by(email=email).first()
    if existing_email:
        if existing_email.email_verified:
            return jsonify({"message": "An account with this email already exists"}), 409
        else:
            db.session.delete(existing_email)
            db.session.commit()

    # Check if a VERIFIED user exists with this username
    existing_username = User.query.filter_by(username=username).first()
    if existing_username:
        if existing_username.email_verified:
            return jsonify({"message": "Username is already taken"}), 409
        else:
            db.session.delete(existing_username)
            db.session.commit()

    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(
        name=name,
        username=username,
        email=email,
        password=hashed_pw,
        email_verified=False
    )
    db.session.add(new_user)
    db.session.commit()

    try:
        error = _send_verification_code(new_user)
        if error:
            return jsonify({"message": error}), 429
    except Exception as exc:
        db.session.rollback()
        return jsonify({"message": f"Failed to send email: {str(exc)}"}), 503

    return jsonify({"message": "OTP sent successfully"}), 200


@auth_bp.route("/signup-verify", methods=["POST"])
def signup_verify():
    """Step 2: Verify OTP to complete registration."""
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    code = data.get("code", "").strip()

    user = User.query.filter_by(email=email).first()
    if not user or user.email_verified:
        return jsonify({"message": "Invalid verification attempt"}), 400

    if user.verification_attempts >= MAX_CODE_ATTEMPTS:
        return jsonify({"message": "Too many attempts. Request a new OTP."}), 429

    if not user.verification_expires_at or user.verification_expires_at < datetime.utcnow() or user.verification_code_hash != hash_code(code):
        user.verification_attempts += 1
        db.session.commit()
        return jsonify({"message": "Invalid or expired OTP"}), 400

    user.email_verified = True
    user.verification_code_hash = None
    user.verification_expires_at = None
    user.verification_attempts = 0
    db.session.commit()

    return jsonify({
        "message": "Account created successfully",
        "access_token": create_access_token(identity=str(user.id)),
        "user": user.to_dict()
    }), 200


@auth_bp.route("/login-init", methods=["POST"])
def login_init():
    """Step 1: Validate 3-field strict matching and send OTP."""
    data = request.get_json(silent=True) or {}
    username = data.get("username", "").strip().lower()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not all([username, email, password]):
        return jsonify({"message": "Invalid credentials"}), 401

    user = User.query.filter_by(username=username, email=email, email_verified=True).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Invalid credentials"}), 401

    try:
        error = _send_verification_code(user)
        if error:
            return jsonify({"message": error}), 429
    except Exception as exc:
        db.session.rollback()
        return jsonify({"message": f"Failed to send email: {str(exc)}"}), 503

    return jsonify({"message": "OTP sent successfully"}), 200


@auth_bp.route("/login-verify", methods=["POST"])
def login_verify():
    """Step 2: Verify OTP to finalize login."""
    data = request.get_json(silent=True) or {}
    username = data.get("username", "").strip().lower()
    email = data.get("email", "").strip().lower()
    code = data.get("code", "").strip()

    user = User.query.filter_by(username=username, email=email, email_verified=True).first()
    if not user:
        return jsonify({"message": "Invalid verification attempt"}), 400

    if user.verification_attempts >= MAX_CODE_ATTEMPTS:
        return jsonify({"message": "Too many attempts. Request a new OTP."}), 429

    if not user.verification_expires_at or user.verification_expires_at < datetime.utcnow() or user.verification_code_hash != hash_code(code):
        user.verification_attempts += 1
        db.session.commit()
        return jsonify({"message": "Invalid or expired OTP"}), 400

    user.verification_code_hash = None
    user.verification_expires_at = None
    user.verification_attempts = 0
    db.session.commit()

    return jsonify({
        "message": f"Welcome back, {user.name}",
        "access_token": create_access_token(identity=str(user.id)),
        "user": user.to_dict()
    }), 200


@auth_bp.route("/resend-otp", methods=["POST"])
def resend_otp():
    """Resend OTP for either signup or login flow."""
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    user = User.query.filter_by(email=email).first()

    if not user:
        # Prevent enumeration
        return jsonify({"message": "If the account exists, an OTP will be sent."}), 200

    try:
        error = _send_verification_code(user)
        if error:
            return jsonify({"message": error}), 429
    except Exception as exc:
        db.session.rollback()
        return jsonify({"message": f"Failed to send email: {str(exc)}"}), 503

    return jsonify({"message": "OTP resent successfully"}), 200


@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json(silent=True) or {}
    email = str(data.get("email", "")).strip().lower()
    user = User.query.filter_by(email=email).first()
    if user and can_send_code(user.reset_sent_at):
        code = generate_code()
        user.reset_code_hash = hash_code(code)
        user.reset_expires_at = code_expiry()
        user.reset_attempts = 0
        user.reset_sent_at = datetime.utcnow()
        try:
            send_code_email(user.email, code, "reset")
            db.session.commit()
        except (OSError, RuntimeError, smtplib.SMTPException) as exc:
            db.session.rollback()
            return jsonify({"message": str(exc)}), 503
    return jsonify({"message": "If an account exists for that email, a reset code will be sent."}), 200


@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json(silent=True) or {}
    email = str(data.get("email", "")).strip().lower()
    code = str(data.get("code", "")).strip()
    password = str(data.get("password", ""))
    user = User.query.filter_by(email=email).first()
    if not user or len(password) < 6:
        return jsonify({"message": "A valid email, reset code, and password of at least 6 characters are required"}), 400
    if user.reset_attempts >= MAX_CODE_ATTEMPTS:
        return jsonify({"message": "Too many attempts. Request a new reset code."}), 429
    if not user.reset_expires_at or user.reset_expires_at < datetime.utcnow() or user.reset_code_hash != hash_code(code):
        user.reset_attempts += 1
        db.session.commit()
        return jsonify({"message": "Invalid or expired reset code"}), 400
    user.password = bcrypt.generate_password_hash(password).decode("utf-8")
    user.reset_code_hash = None
    user.reset_expires_at = None
    user.reset_attempts = 0
    db.session.commit()
    return jsonify({"message": "Password reset successfully. You can now sign in."}), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    """Fetch current authenticated user profile."""
    current_user_id = int(get_jwt_identity())
    user = db.session.get(User, current_user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({"user": user.to_dict()}), 200
