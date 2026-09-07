import random
from datetime import datetime
from flask import Blueprint, request, jsonify
from database import db
from models.report import CommunityReport, CommunityReportUpdate
from models.notification import Notification
from models.department import Department
from middleware.auth_middleware import jwt_required_custom, roles_accepted, decode_jwt_token
from models.user import User

report_bp = Blueprint('report_bp', __name__)

def generate_report_ref():
    year = datetime.utcnow().year
    num = random.randint(1000, 9999)
    ref = f"RMN-REP-{num}"
    while CommunityReport.query.filter_by(reference_code=ref).first() is not None:
        num = random.randint(1000, 9999)
        ref = f"RMN-REP-{num}"
    return ref

@report_bp.route('', methods=['POST'])
def submit_report():
    # Can be submitted authenticated or anonymous
    data = request.get_json() or {}
    
    title = data.get('title', '').strip()
    category = data.get('category', '').strip()
    description = data.get('description', '').strip()
    location_name = data.get('location_name', '').strip()
    community_area = data.get('community_area', '').strip() or 'Isara-Remo'
    
    if not title or not category or not description or not location_name:
        return jsonify({'error': 'Title, category, description, and location name are required.'}), 400
        
    ref_code = generate_report_ref()
    
    # Check if user is logged in
    citizen_id = None
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split()[1]
        payload = decode_jwt_token(token)
        if payload:
            citizen_id = payload.get('sub')
            
    # Auto-assign initial department based on category
    category_dept_map = {
        'Roads & Transport': 'WORKS',
        'Blocked drainage': 'WORKS',
        'Drainage & Flood': 'WORKS',
        'Street Lighting': 'WORKS',
        'Waste & Sanitation': 'HEALTH',
        'Waste disposal problems': 'HEALTH',
        'Water Supply': 'WORKS',
        'Public Facilities': 'WORKS'
    }
    dept_code = category_dept_map.get(category, 'ADMIN')
    dept = Department.query.filter_by(code=dept_code).first()
    
    report = CommunityReport(
        reference_code=ref_code,
        citizen_id=citizen_id,
        title=title,
        category=category,
        description=description,
        location_name=location_name,
        community_area=community_area,
        latitude=data.get('latitude'),
        longitude=data.get('longitude'),
        image_url=data.get('image_url'),
        reporter_name=data.get('reporter_name'),
        reporter_phone=data.get('reporter_phone'),
        status='Submitted',
        assigned_department_id=dept.id if dept else None
    )
    
    db.session.add(report)
    db.session.flush()
    
    # Add initial update entry
    initial_update = CommunityReportUpdate(
        report_id=report.id,
        status='Submitted',
        comment='Report lodged by citizen. Pending triage by council team.'
    )
    db.session.add(initial_update)
    
    # If citizen logged in, send them a notification
    if citizen_id:
        notif = Notification(
            user_id=citizen_id,
            title="Community Report Submitted",
            message=f"Thank you for reporting '{title}'. Your reference code is {ref_code}. The council will investigate.",
            notification_type="report",
            related_entity_type="report",
            related_entity_id=report.id
        )
        db.session.add(notif)
        
    db.session.commit()
    
    return jsonify({
        'message': 'Community problem reported successfully. Thank you for helping improve Remo North!',
        'reference_code': ref_code,
        'report': report.to_dict()
    }), 201

@report_bp.route('', methods=['GET'])
def list_reports():
    category = request.args.get('category')
    status = request.args.get('status')
    community_area = request.args.get('community_area')
    mine_only = request.args.get('mine') == 'true'
    search = request.args.get('search')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 30))
    
    query = CommunityReport.query
    
    if mine_only:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Unauthorized'}), 401
        payload = decode_jwt_token(auth_header.split()[1])
        if not payload:
            return jsonify({'error': 'Invalid token'}), 401
        query = query.filter_by(citizen_id=payload.get('sub'))
        
    if category and category.lower() != 'all':
        query = query.filter_by(category=category)
        
    if status and status.lower() != 'all':
        query = query.filter_by(status=status)
        
    if community_area and community_area.lower() != 'all':
        query = query.filter_by(community_area=community_area)
        
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (CommunityReport.title.ilike(search_term)) | 
            (CommunityReport.description.ilike(search_term)) | 
            (CommunityReport.location_name.ilike(search_term)) | 
            (CommunityReport.reference_code.ilike(search_term))
        )
        
    total = query.count()
    reports = query.order_by(CommunityReport.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()
    
    return jsonify({
        'total': total,
        'page': page,
        'per_page': per_page,
        'reports': [r.to_dict() for r in reports]
    }), 200

@report_bp.route('/<int:report_id>', methods=['GET'])
def get_report_detail(report_id):
    report = CommunityReport.query.get_or_404(report_id)
    return jsonify({'report': report.to_dict()}), 200

@report_bp.route('/<int:report_id>/status', methods=['PUT'])
@roles_accepted('admin', 'staff')
def update_report_status(current_user, report_id):
    report = CommunityReport.query.get_or_404(report_id)
    data = request.get_json() or {}
    
    new_status = data.get('status')
    valid_statuses = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved']
    if new_status not in valid_statuses:
        return jsonify({'error': f'Invalid status. Allowed: {", ".join(valid_statuses)}'}), 400
        
    comment = data.get('comment', '').strip()
    resolution_notes = data.get('resolution_notes', '').strip()
    resolution_image_url = data.get('resolution_image_url')
    assigned_staff_id = data.get('assigned_staff_id')
    assigned_department_id = data.get('assigned_department_id')
    
    report.status = new_status
    if assigned_staff_id:
        report.assigned_staff_id = assigned_staff_id
    if assigned_department_id:
        report.assigned_department_id = assigned_department_id
        
    if new_status == 'Resolved':
        report.resolved_at = datetime.utcnow()
        if resolution_notes:
            report.resolution_notes = resolution_notes
        if resolution_image_url:
            report.resolution_image_url = resolution_image_url
            
    # Add status update entry
    update_entry = CommunityReportUpdate(
        report_id=report.id,
        status=new_status,
        comment=comment or f"Status changed to {new_status} by officer {current_user.full_name}.",
        updated_by_user_id=current_user.id
    )
    db.session.add(update_entry)
    
    # Notify citizen author if registered
    if report.citizen_id:
        notif = Notification(
            user_id=report.citizen_id,
            title=f"Report Update: {report.reference_code}",
            message=f"Your community report '{report.title}' is now '{new_status}'. {comment if comment else ''}",
            notification_type="report",
            related_entity_type="report",
            related_entity_id=report.id
        )
        db.session.add(notif)
        
    db.session.commit()
    
    return jsonify({
        'message': f'Report status updated to {new_status}.',
        'report': report.to_dict()
    }), 200
