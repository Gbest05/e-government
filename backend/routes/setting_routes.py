from flask import Blueprint, request, jsonify
from database import db
from models.setting import Setting
from middleware.auth_middleware import roles_accepted

setting_bp = Blueprint('setting_bp', __name__)

def get_or_create_settings():
    settings = Setting.query.first()
    if not settings:
        settings = Setting()
        db.session.add(settings)
        db.session.commit()
    return settings

@setting_bp.route('', methods=['GET'])
@setting_bp.route('/', methods=['GET'])
def get_settings():
    """Public endpoint to fetch current website branding & landing page configuration."""
    settings = get_or_create_settings()
    return jsonify({
        'status': 'success',
        'settings': settings.to_dict()
    }), 200

@setting_bp.route('', methods=['PUT'])
@setting_bp.route('/', methods=['PUT'])
@roles_accepted('admin')
def update_settings(current_user):
    """Admin-only endpoint to update website branding, logo, and landing page content."""
    settings = get_or_create_settings()
    data = request.get_json() or {}

    fields = [
        'site_name',
        'site_short_name',
        'logo_url',
        'hero_badge',
        'hero_title',
        'hero_subtitle',
        'hero_cta_primary',
        'hero_cta_secondary',
        'announcement_banner',
        'secretariat_address',
        'emergency_helpline',
        'main_phone',
        'official_email',
        'state_name',
        'about_summary'
    ]

    for field in fields:
        if field in data:
            val = data[field]
            if val is not None and isinstance(val, str):
                val = val.strip()
            setattr(settings, field, val)

    db.session.commit()

    return jsonify({
        'status': 'success',
        'message': 'Website settings and landing page configuration updated successfully.',
        'settings': settings.to_dict()
    }), 200
