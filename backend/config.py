import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
INSTANCE_DIR = os.path.join(BASE_DIR, 'instance')
os.makedirs(INSTANCE_DIR, exist_ok=True)

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'remo-north-secret-key-2026-prod-fallback')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'remo-north-jwt-secret-key-2026-xyz')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    
    # SQLite Database config with clean PostgreSQL migration readiness
    default_sqlite_path = os.path.join(INSTANCE_DIR, 'egovern.sqlite').replace('\\', '/')
    db_env = os.environ.get('DATABASE_URL')
    
    if db_env:
        if db_env.startswith('postgres://'):
            SQLALCHEMY_DATABASE_URI = db_env.replace('postgres://', 'postgresql://', 1)
        elif db_env.startswith('sqlite:///'):
            # If relative, convert to absolute
            path_part = db_env[len('sqlite:///'):]
            if not os.path.isabs(path_part):
                SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, path_part).replace('\\', '/')}"
            else:
                SQLALCHEMY_DATABASE_URI = db_env
        else:
            SQLALCHEMY_DATABASE_URI = db_env
    else:
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{default_sqlite_path}"
        
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Upload folder for local fallback
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max limit
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf', 'doc', 'docx', 'webp'}
    
    # Cloudinary configuration
    CLOUDINARY_CLOUD_NAME = os.environ.get('CLOUDINARY_CLOUD_NAME', '')
    CLOUDINARY_API_KEY = os.environ.get('CLOUDINARY_API_KEY', '')
    CLOUDINARY_API_SECRET = os.environ.get('CLOUDINARY_API_SECRET', '')

    # CORS configuration
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')
