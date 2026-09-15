"""
Shared Flask extension instances.
Import these in blueprints and models to avoid circular imports.
"""
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt

db     = SQLAlchemy()
jwt    = JWTManager()
bcrypt = Bcrypt()
