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


@auth_bp.route("/signup", methods=["POST"])
def signup():
    """Register a new user account."""
    data = request.get_json(silent=True) or {}

    required = ["name", "username", "email", "password"]
    for field in required:
        if not data.get(field) or not str(data.get(field)).strip():
            return jsonify({"message": f"Field '{field}' is required"}), 400

    name = data["name"].strip()
    username = data["username"].strip().lower()
    email = data["email"].strip().lower()
    password = data["password"]

    if not re.match(EMAIL_REGEX, email):
        return jsonify({"message": "Please provide a valid email address"}), 400

    if len(username) < 3:
        return jsonify({"message": "Username must be at least 3 characters long"}), 400

    if len(password) < 6:
        return jsonify({"message": "Password must be at least 6 characters long"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "An account with this email already exists"}), 409

    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username is already taken"}), 409

    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(
        name=name,
        username=username,
        email=email,
        password=hashed_pw
    )

    new_user.email_verified = True
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "Account created successfully",
        "access_token": create_access_token(identity=str(new_user.id)),
        "user": new_user.to_dict(),
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate existing user and issue JWT."""
    data = request.get_json(silent=True) or {}

    identifier = str(data.get("identifier", "")).strip().lower()
    password = str(data.get("password", ""))

    if not identifier or not password:
        return jsonify({"message": "Username/email and password are required"}), 400

    user = User.query.filter(
        (User.username == identifier) | (User.email == identifier)
    ).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Invalid username/email or password"}), 401
    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": f"Welcome back, {user.name}",
        "access_token": access_token,
        "user": user.to_dict()
    }), 200


def _send_verification_code(user):
    if not can_send_code(user.verification_sent_at):
        return "Please wait before requesting another verification code."
    code = generate_code()
    user.verification_code_hash = hash_code(code)
    user.verification_expires_at = code_expiry()
    user.verification_attempts = 0
    user.verification_sent_at = datetime.utcnow()
    send_code_email(user.email, code, "verification")
    db.session.commit()
    return None


@auth_bp.route("/verify-email", methods=["POST"])
def verify_email():
    data = request.get_json(silent=True) or {}
    email = str(data.get("email", "")).strip().lower()
    code = str(data.get("code", "")).strip()
    user = User.query.filter_by(email=email).first()
    if not user or user.email_verified:
        return jsonify({"message": "Invalid or expired verification code"}), 400
    if user.verification_attempts >= MAX_CODE_ATTEMPTS:
        return jsonify({"message": "Too many attempts. Request a new verification code."}), 429
    if not user.verification_expires_at or user.verification_expires_at < datetime.utcnow() or user.verification_code_hash != hash_code(code):
        user.verification_attempts += 1
        db.session.commit()
        return jsonify({"message": "Invalid or expired verification code"}), 400
    user.email_verified = True
    user.verification_code_hash = None
    user.verification_expires_at = None
    user.verification_attempts = 0
    db.session.commit()
    return jsonify({"message": "Email verified successfully. You can now sign in."}), 200


@auth_bp.route("/resend-verification", methods=["POST"])
def resend_verification():
    data = request.get_json(silent=True) or {}
    email = str(data.get("email", "")).strip().lower()
    user = User.query.filter_by(email=email).first()
    if not user or user.email_verified:
        return jsonify({"message": "If the account exists and needs verification, a code will be sent."}), 200
    try:
        error = _send_verification_code(user)
    except (OSError, RuntimeError, smtplib.SMTPException) as exc:
        db.session.rollback()
        return jsonify({"message": str(exc)}), 503
    if error:
        return jsonify({"message": error}), 429
    return jsonify({"message": "A new verification code has been sent."}), 200


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
