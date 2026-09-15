import json
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Resume

resume_bp = Blueprint("resume", __name__)


@resume_bp.route("/", methods=["POST"])
@jwt_required()
def create_resume():
    """Create and persist a new resume for the authenticated user."""
    current_user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}

    title = data.get("title", "").strip()
    template_id = data.get("template_id", "").strip()
    content = data.get("content")

    if not title or not template_id or content is None:
        return jsonify({
            "message": "Missing required fields: title, template_id, content"
        }), 400

    content_str = json.dumps(content) if not isinstance(content, str) else content

    new_resume = Resume(
        user_id=current_user_id,
        title=title,
        template_id=template_id,
        content=content_str
    )

    db.session.add(new_resume)
    db.session.commit()

    return jsonify({
        "message": "Resume saved successfully",
        "resume": new_resume.to_dict()
    }), 201


@resume_bp.route("/", methods=["GET"])
@jwt_required()
def list_resumes():
    """Retrieve all resumes owned by the current user."""
    current_user_id = int(get_jwt_identity())
    resumes = (
        Resume.query.filter_by(user_id=current_user_id)
        .order_by(Resume.updated_at.desc())
        .all()
    )
    return jsonify([resume.to_dict() for resume in resumes]), 200


@resume_bp.route("/<int:resume_id>", methods=["GET"])
@jwt_required()
def get_resume(resume_id):
    """Retrieve details and full content of a specific resume."""
    current_user_id = int(get_jwt_identity())
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user_id).first()

    if not resume:
        return jsonify({"message": "Resume not found"}), 404

    return jsonify(resume.to_dict(include_content=True)), 200


@resume_bp.route("/<int:resume_id>", methods=["PUT"])
@jwt_required()
def update_resume(resume_id):
    """Update an existing resume."""
    current_user_id = int(get_jwt_identity())
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user_id).first()

    if not resume:
        return jsonify({"message": "Resume not found"}), 404

    data = request.get_json(silent=True) or {}

    if "title" in data and str(data["title"]).strip():
        resume.title = str(data["title"]).strip()

    if "template_id" in data and str(data["template_id"]).strip():
        resume.template_id = str(data["template_id"]).strip()

    if "content" in data and data["content"] is not None:
        content = data["content"]
        resume.content = json.dumps(content) if not isinstance(content, str) else content

    resume.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "message": "Resume updated successfully",
        "resume": resume.to_dict(include_content=True)
    }), 200


@resume_bp.route("/<int:resume_id>", methods=["DELETE"])
@jwt_required()
def delete_resume(resume_id):
    """Delete a resume by ID."""
    current_user_id = int(get_jwt_identity())
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user_id).first()

    if not resume:
        return jsonify({"message": "Resume not found"}), 404

    db.session.delete(resume)
    db.session.commit()

    return jsonify({"message": "Resume deleted successfully"}), 200
