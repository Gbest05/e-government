from flask import Blueprint, request, jsonify
from services.upload_service import save_uploaded_file

upload_bp = Blueprint('upload_bp', __name__)

@upload_bp.route('', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in request.'}), 400
        
    file = request.files['file']
    folder = request.form.get('folder', 'documents')
    
    try:
        result = save_uploaded_file(file, folder_name=folder)
        if not result:
            return jsonify({'error': 'No file selected.'}), 400
        return jsonify({
            'message': 'File uploaded successfully.',
            'file': result
        }), 201
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500
