import os
from datetime import timedelta
from flask import Flask, jsonify, send_from_directory
from sqlalchemy import inspect, text
from flask_cors import CORS
from dotenv import load_dotenv

from extensions import db, jwt, bcrypt

load_dotenv()


def create_app():
    basedir = os.path.abspath(os.path.dirname(__file__))
    frontend_dist = os.path.abspath(os.path.join(basedir, "..", "frontend", "dist"))
    app = Flask(__name__, static_folder=None)

    def serve_frontend(filename):
        response = send_from_directory(frontend_dist, filename)
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        response.headers["Pragma"] = "no-cache"
        return response

    # CORS configuration
    allowed_origins = os.getenv(
        "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",")

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": allowed_origins,
                "allow_headers": ["Content-Type", "Authorization"],
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            }
        },
    )

    # Database configuration
    database_url = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{os.path.join(basedir, 'resume_app.db')}"
    )

    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # JWT configuration
    app.config["JWT_SECRET_KEY"] = os.getenv(
        "JWT_SECRET_KEY", "dev-jwt-secret-change-in-production"
    )
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)
    app.config["SMTP_HOST"] = os.getenv("SMTP_HOST", "")
    app.config["SMTP_PORT"] = int(os.getenv("SMTP_PORT", "587"))
    app.config["SMTP_USERNAME"] = os.getenv("SMTP_USERNAME", "")
    app.config["SMTP_PASSWORD"] = os.getenv("SMTP_PASSWORD", "")
    app.config["SMTP_FROM"] = os.getenv("SMTP_FROM", "")
    app.config["SMTP_USE_TLS"] = os.getenv("SMTP_USE_TLS", "starttls").lower()

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)

    # Register blueprints
    from auth.auth_routes import auth_bp
    from create_resume.resume_routes import resume_bp
    from analysis_routes import analysis_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(resume_bp, url_prefix="/api/resume")
    app.register_blueprint(analysis_bp, url_prefix="/api/analysis")

    with app.app_context():
        from models import User, Resume, Analysis  # noqa: F401
        db.create_all()
        columns = {column["name"] for column in inspect(db.engine).get_columns("users")}
        migrations = {
            "email_verified": "BOOLEAN NOT NULL DEFAULT 0",
            "verification_code_hash": "VARCHAR(64)",
            "verification_expires_at": "DATETIME",
            "verification_attempts": "INTEGER NOT NULL DEFAULT 0",
            "verification_sent_at": "DATETIME",
            "reset_code_hash": "VARCHAR(64)",
            "reset_expires_at": "DATETIME",
            "reset_attempts": "INTEGER NOT NULL DEFAULT 0",
            "reset_sent_at": "DATETIME",
        }
        with db.engine.begin() as connection:
            for column, definition in migrations.items():
                if column not in columns:
                    connection.execute(text(f"ALTER TABLE users ADD COLUMN {column} {definition}"))

    # API health check endpoint
    @app.route("/", methods=["GET"])
    def index():
        index_file = os.path.join(frontend_dist, "index.html")
        if os.path.exists(index_file):
            return serve_frontend("index.html")
        return jsonify({
            "status": "success",
            "message": "ResumeCraft API is running successfully",
            "version": "1.0.0"
        })

    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({
            "status": "success",
            "message": "ResumeCraft API is running successfully",
            "version": "1.0.0"
        })

    @app.route("/<path:path>", methods=["GET"])
    def frontend_route(path):
        if path.startswith("api/"):
            return jsonify({"message": "API endpoint not found"}), 404
        requested_file = os.path.join(frontend_dist, path)
        if os.path.isfile(requested_file):
            return serve_frontend(path)
        index_file = os.path.join(frontend_dist, "index.html")
        if os.path.exists(index_file):
            return serve_frontend("index.html")
        return jsonify({"message": "Frontend build not found. Run npm run build in frontend/"}), 404

    return app


app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "True").lower() in ("true", "1", "yes")
    app.run(host="0.0.0.0", port=port, debug=debug)