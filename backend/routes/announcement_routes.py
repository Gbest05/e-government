from datetime import datetime
from flask import Blueprint, request, jsonify
from database import db
from models.announcement import Announcement
from middleware.auth_middleware import roles_accepted

announcement_bp = Blueprint('announcement_bp', __name__)

@announcement_bp.route('', methods=['GET'])
def list_announcements():
    category = request.args.get('category')
    all_records = request.args.get('all') == 'true'
    search = request.args.get('search')
    
    query = Announcement.query
    
    if not all_records:
        query = query.filter_by(is_published=True)
        # Check expiry date if set
        now = datetime.utcnow()
        query = query.filter((Announcement.expiry_date.is_(None)) | (Announcement.expiry_date >= now))
        
    if category and category.lower() != 'all':
        query = query.filter_by(category=category)
        
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Announcement.title.ilike(search_term)) |
            (Announcement.content.ilike(search_term))
        )
        
    # Pinned first, then by publish_date descending
    announcements = query.order_by(Announcement.is_pinned.desc(), Announcement.publish_date.desc()).all()
    
    return jsonify({
        'count': len(announcements),
        'announcements': [a.to_dict() for a in announcements]
    }), 200

@announcement_bp.route('/<int:announcement_id>', methods=['GET'])
def get_announcement(announcement_id):
    announcement = Announcement.query.get_or_404(announcement_id)
    return jsonify({'announcement': announcement.to_dict()}), 200

@announcement_bp.route('', methods=['POST'])
@roles_accepted('admin')
def create_announcement(current_user):
    data = request.get_json() or {}
    
    title = data.get('title', '').strip()
    content = data.get('content', '').strip()
    category = data.get('category', 'Public Notice').strip()
    
    if not title or not content:
        return jsonify({'error': 'Title and content are required.'}), 400
        
    expiry_date = None
    if data.get('expiry_date'):
        try:
            expiry_date = datetime.fromisoformat(data['expiry_date'].replace('Z', '+00:00'))
        except Exception:
            pass
            
    announcement = Announcement(
        title=title,
        content=content,
        category=category,
        image_url=data.get('image_url'),
        target_audience=data.get('target_audience', 'All Citizens'),
        is_pinned=bool(data.get('is_pinned', False)),
        is_published=bool(data.get('is_published', True)),
        publish_date=datetime.utcnow(),
        expiry_date=expiry_date,
        author_id=current_user.id
    )
    
    db.session.add(announcement)
    db.session.commit()
    
    return jsonify({
        'message': 'Announcement published successfully.',
        'announcement': announcement.to_dict()
    }), 201

@announcement_bp.route('/<int:announcement_id>', methods=['PUT'])
@roles_accepted('admin')
def update_announcement(current_user, announcement_id):
    announcement = Announcement.query.get_or_404(announcement_id)
    data = request.get_json() or {}
    
    if 'title' in data:
        announcement.title = data['title'].strip()
    if 'content' in data:
        announcement.content = data['content'].strip()
    if 'category' in data:
        announcement.category = data['category'].strip()
    if 'image_url' in data:
        announcement.image_url = data['image_url']
    if 'target_audience' in data:
        announcement.target_audience = data['target_audience']
    if 'is_pinned' in data:
        announcement.is_pinned = bool(data['is_pinned'])
    if 'is_published' in data:
        announcement.is_published = bool(data['is_published'])
        
    db.session.commit()
    return jsonify({
        'message': 'Announcement updated successfully.',
        'announcement': announcement.to_dict()
    }), 200

@announcement_bp.route('/<int:announcement_id>', methods=['DELETE'])
@roles_accepted('admin')
def delete_announcement(current_user, announcement_id):
    announcement = Announcement.query.get_or_404(announcement_id)
    db.session.delete(announcement)
    db.session.commit()
    return jsonify({'message': 'Announcement deleted successfully.'}), 200
