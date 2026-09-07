from flask import Blueprint, jsonify
from database import db
from models.notification import Notification
from middleware.auth_middleware import jwt_required_custom

notification_bp = Blueprint('notification_bp', __name__)

@notification_bp.route('', methods=['GET'])
@jwt_required_custom
def get_user_notifications(current_user):
    notifications = Notification.query.filter_by(user_id=current_user.id).order_by(Notification.created_at.desc()).limit(50).all()
    unread_count = Notification.query.filter_by(user_id=current_user.id, is_read=False).count()
    
    return jsonify({
        'unread_count': unread_count,
        'notifications': [n.to_dict() for n in notifications]
    }), 200

@notification_bp.route('/<int:notif_id>/read', methods=['PUT'])
@jwt_required_custom
def mark_notification_read(current_user, notif_id):
    notif = Notification.query.filter_by(id=notif_id, user_id=current_user.id).first_or_404()
    notif.is_read = True
    db.session.commit()
    return jsonify({'message': 'Marked as read.'}), 200

@notification_bp.route('/read-all', methods=['PUT'])
@jwt_required_custom
def mark_all_read(current_user):
    Notification.query.filter_by(user_id=current_user.id, is_read=False).update({'is_read': True})
    db.session.commit()
    return jsonify({'message': 'All notifications marked as read.'}), 200
