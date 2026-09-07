import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from config import Config
from database import db

# Import blueprints
from routes.auth_routes import auth_bp
from routes.service_routes import service_bp
from routes.application_routes import application_bp
from routes.report_routes import report_bp
from routes.complaint_routes import complaint_bp
from routes.announcement_routes import announcement_bp
from routes.notification_routes import notification_bp
from routes.department_routes import department_bp
from routes.admin_routes import admin_bp
from routes.staff_routes import staff_bp
from routes.upload_routes import upload_bp

def create_app(config_class=Config):
    app = Flask(__name__, static_folder='static')
    app.config.from_object(config_class)

    # Initialize CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Ensure required directories exist
    os.makedirs(os.path.join(app.root_path, 'instance'), exist_ok=True)
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Initialize extensions
    db.init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(service_bp, url_prefix='/api/services')
    app.register_blueprint(application_bp, url_prefix='/api/applications')
    app.register_blueprint(report_bp, url_prefix='/api/reports')
    app.register_blueprint(complaint_bp, url_prefix='/api/complaints')
    app.register_blueprint(announcement_bp, url_prefix='/api/announcements')
    app.register_blueprint(notification_bp, url_prefix='/api/notifications')
    app.register_blueprint(department_bp, url_prefix='/api/departments')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(staff_bp, url_prefix='/api/staff')
    app.register_blueprint(upload_bp, url_prefix='/api/upload')

    # Serve uploaded files locally when not using cloud storage
    @app.route('/static/uploads/<path:filename>')
    def serve_upload(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    # Health check for Render / monitoring
    @app.route('/api/health')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'Remo North Local Government E-Government API',
            'state': 'Ogun State, Nigeria',
            'version': '1.0.0'
        }), 200

    # User-friendly error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({
            'error': 'The requested resource could not be found.',
            'status_code': 404
        }), 404

    @app.errorhandler(400)
    def bad_request_error(error):
        return jsonify({
            'error': 'Invalid request parameters or malformed data.',
            'status_code': 400
        }), 400

    @app.errorhandler(500)
    def internal_error(error):
        app.logger.error(f"Internal Server Error: {str(error)}")
        return jsonify({
            'error': 'Something went wrong while processing your request. Please try again later.',
            'status_code': 500
        }), 500

    return app

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
