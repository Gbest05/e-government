import os
import uuid
from werkzeug.utils import secure_filename
from flask import current_app
import cloudinary
import cloudinary.uploader

def allowed_file(filename):
    allowed = current_app.config.get('ALLOWED_EXTENSIONS', {'png', 'jpg', 'jpeg', 'gif', 'pdf', 'doc', 'docx'})
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed

def save_uploaded_file(file_storage, folder_name='egovern'):
    """
    Saves file to Cloudinary if configured; otherwise saves to local backend/static/uploads directory.
    Returns:
        dict: {'url': file_url, 'filename': original_name, 'file_type': extension}
    """
    if not file_storage or file_storage.filename == '':
        return None

    filename = secure_filename(file_storage.filename)
    if not allowed_file(filename):
        raise ValueError(f"File type not permitted. Allowed: {', '.join(current_app.config.get('ALLOWED_EXTENSIONS'))}")

    cloud_name = current_app.config.get('CLOUDINARY_CLOUD_NAME')
    api_key = current_app.config.get('CLOUDINARY_API_KEY')
    api_secret = current_app.config.get('CLOUDINARY_API_SECRET')

    # If Cloudinary is configured with non-empty credentials
    if cloud_name and api_key and api_secret:
        try:
            cloudinary.config(
                cloud_name=cloud_name,
                api_key=api_key,
                api_secret=api_secret,
                secure=True
            )
            # Determine resource_type
            ext = filename.rsplit('.', 1)[1].lower()
            resource_type = 'image' if ext in {'png', 'jpg', 'jpeg', 'gif', 'webp'} else 'raw'
            upload_result = cloudinary.uploader.upload(
                file_storage,
                folder=f"remo_north/{folder_name}",
                resource_type=resource_type
            )
            return {
                'url': upload_result.get('secure_url'),
                'filename': filename,
                'file_type': ext,
                'public_id': upload_result.get('public_id')
            }
        except Exception as e:
            current_app.logger.warning(f"Cloudinary upload failed ({str(e)}). Falling back to local storage.")

    # Local fallback
    upload_dir = current_app.config.get('UPLOAD_FOLDER')
    os.makedirs(upload_dir, exist_ok=True)
    ext = filename.rsplit('.', 1)[1].lower()
    unique_filename = f"{uuid.uuid4().hex[:12]}_{filename}"
    file_path = os.path.join(upload_dir, unique_filename)
    file_storage.seek(0)
    file_storage.save(file_path)

    # Return local accessible URL
    url = f"/static/uploads/{unique_filename}"
    return {
        'url': url,
        'filename': filename,
        'file_type': ext,
        'public_id': None
    }
