import json
from datetime import datetime
from extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default="user")
    email_verified = db.Column(db.Boolean, default=False, nullable=False)
    verification_code_hash = db.Column(db.String(64))
    verification_expires_at = db.Column(db.DateTime)
    verification_attempts = db.Column(db.Integer, default=0, nullable=False)
    verification_sent_at = db.Column(db.DateTime)
    reset_code_hash = db.Column(db.String(64))
    reset_expires_at = db.Column(db.DateTime)
    reset_attempts = db.Column(db.Integer, default=0, nullable=False)
    reset_sent_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    resumes = db.relationship("Resume", backref="owner", lazy=True, cascade="all, delete-orphan")
    analyses = db.relationship("Analysis", backref="user", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "email_verified": self.email_verified,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Resume(db.Model):
    __tablename__ = "resumes"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    template_id = db.Column(db.String(50), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self, include_content=False):
        data = {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "template_id": self.template_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_content:
            try:
                data["content"] = json.loads(self.content)
            except (ValueError, TypeError):
                data["content"] = self.content
        return data


class Analysis(db.Model):
    __tablename__ = "analyses"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    filename = db.Column(db.String(200))
    overall_score = db.Column(db.Integer)
    ats_score = db.Column(db.Integer)
    report_data = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        data = {
            "id": self.id,
            "user_id": self.user_id,
            "filename": self.filename,
            "overall_score": self.overall_score,
            "ats_score": self.ats_score,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
        if self.report_data:
            try:
                data["report_data"] = json.loads(self.report_data)
            except (ValueError, TypeError):
                data["report_data"] = self.report_data
        return data
