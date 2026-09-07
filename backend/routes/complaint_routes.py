import random
from datetime import datetime
from flask import Blueprint, request, jsonify
from database import db
from models.complaint import Complaint, ComplaintUpdate
from models.notification import Notification
from middleware.auth_middleware import jwt_required_custom, roles_accepted

complaint_bp = Blueprint('complaint_bp', __name__)

def generate_complaint_ref():
    num = random.randint(1000, 9999)
    ref = f"RMN-CMP-{num}"
    while Complaint.query.filter_by(reference_code=ref).first() is not None:
        num = random.randint(1000, 9999)
        ref = f"RMN-CMP-{num}"
    return ref

@complaint_bp.route('', methods=['POST'])
@jwt_required_custom
def submit_complaint(current_user):
    data = request.get_json() or {}
    
    subject = data.get('subject', '').strip()
    category = data.get('category', '').strip()
    description = data.get('description', '').strip()
    
    if not subject or not category or not description:
        return jsonify({'error': 'Subject, category, and description are required.'}), 400
        
    ref_code = generate_complaint_ref()
    
    complaint = Complaint(
        reference_code=ref_code,
        citizen_id=current_user.id,
        subject=subject,
        category=category,
        description=description,
        related_application_ref=data.get('related_application_ref', '').strip(),
        document_url=data.get('document_url'),
        status='Submitted'
    )
    
    db.session.add(complaint)
    db.session.flush()
    
    # Initial status entry
    initial_update = ComplaintUpdate(
        complaint_id=complaint.id,
        status='Submitted',
        comment='Complaint filed. Assigned to council oversight for review.',
        updated_by_user_id=current_user.id
    )
    db.session.add(initial_update)
    
    notif = Notification(
        user_id=current_user.id,
        title="Complaint Lodged",
        message=f"Your complaint '{subject}' (Ref: {ref_code}) has been logged. Council officers will investigate.",
        notification_type="complaint",
        related_entity_type="complaint",
        related_entity_id=complaint.id
    )
    db.session.add(notif)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Complaint submitted successfully.',
        'reference_code': ref_code,
        'complaint': complaint.to_dict()
    }), 201

@complaint_bp.route('', methods=['GET'])
@jwt_required_custom
def list_complaints(current_user):
    category = request.args.get('category')
    status = request.args.get('status')
    search = request.args.get('search')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))
    
    query = Complaint.query
    
    if current_user.role == 'citizen':
        query = query.filter_by(citizen_id=current_user.id)
    elif current_user.role == 'staff':
        if current_user.department_id:
            query = query.filter(
                (Complaint.assigned_department_id == current_user.department_id) |
                (Complaint.assigned_staff_id == current_user.id) |
                (Complaint.assigned_department_id.is_(None))
            )
            
    if category and category.lower() != 'all':
        query = query.filter_by(category=category)
        
    if status and status.lower() != 'all':
        query = query.filter_by(status=status)
        
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Complaint.subject.ilike(search_term)) |
            (Complaint.description.ilike(search_term)) |
            (Complaint.reference_code.ilike(search_term))
        )
        
    total = query.count()
    complaints = query.order_by(Complaint.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()
    
    return jsonify({
        'total': total,
        'page': page,
        'per_page': per_page,
        'complaints': [c.to_dict() for c in complaints]
    }), 200

@complaint_bp.route('/<int:complaint_id>', methods=['GET'])
@jwt_required_custom
def get_complaint_detail(current_user, complaint_id):
    complaint = Complaint.query.get_or_404(complaint_id)
    
    if current_user.role == 'citizen' and complaint.citizen_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
        
    return jsonify({'complaint': complaint.to_dict()}), 200

@complaint_bp.route('/<int:complaint_id>/status', methods=['PUT'])
@roles_accepted('admin', 'staff')
def update_complaint_status(current_user, complaint_id):
    complaint = Complaint.query.get_or_404(complaint_id)
    data = request.get_json() or {}
    
    new_status = data.get('status')
    valid_statuses = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed']
    if new_status not in valid_statuses:
        return jsonify({'error': f'Invalid status. Allowed: {", ".join(valid_statuses)}'}), 400
        
    comment = data.get('comment', '').strip()
    resolution_notes = data.get('resolution_notes', '').strip()
    
    complaint.status = new_status
    if resolution_notes:
        complaint.resolution_notes = resolution_notes
    if new_status in ['Resolved', 'Closed']:
        complaint.resolved_at = datetime.utcnow()
        
    update_entry = ComplaintUpdate(
        complaint_id=complaint.id,
        status=new_status,
        comment=comment or f"Status updated to {new_status} by officer {current_user.full_name}.",
        updated_by_user_id=current_user.id
    )
    db.session.add(update_entry)
    
    notif = Notification(
        user_id=complaint.citizen_id,
        title=f"Complaint Update: {complaint.reference_code}",
        message=f"Your complaint '{complaint.subject}' status is now '{new_status}'. {comment if comment else ''}",
        notification_type="complaint",
        related_entity_type="complaint",
        related_entity_id=complaint.id
    )
    db.session.add(notif)
    
    db.session.commit()
    
    return jsonify({
        'message': f'Complaint status updated to {new_status}.',
        'complaint': complaint.to_dict()
    }), 200
