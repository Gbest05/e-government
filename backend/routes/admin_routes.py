from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from database import db
from models.user import User
from models.department import Department
from models.service import Service
from models.application import Application
from models.report import CommunityReport
from models.complaint import Complaint
from middleware.auth_middleware import roles_accepted

admin_bp = Blueprint('admin_bp', __name__)

@admin_bp.route('/dashboard', methods=['GET'])
@roles_accepted('admin')
def get_admin_dashboard(current_user):
    total_citizens = User.query.filter_by(role='citizen').count()
    total_staff = User.query.filter_by(role='staff').count()
    total_applications = Application.query.count()
    pending_applications = Application.query.filter(Application.status.in_(['Submitted', 'Under Review', 'Processing'])).count()
    approved_applications = Application.query.filter_by(status='Approved').count()
    completed_applications = Application.query.filter_by(status='Completed').count()
    
    total_complaints = Complaint.query.count()
    active_complaints = Complaint.query.filter(Complaint.status.in_(['Submitted', 'Under Review', 'Assigned', 'In Progress'])).count()
    resolved_complaints = Complaint.query.filter(Complaint.status.in_(['Resolved', 'Closed'])).count()
    
    total_reports = CommunityReport.query.count()
    resolved_reports = CommunityReport.query.filter_by(status='Resolved').count()
    active_reports = total_reports - resolved_reports
    
    total_services = Service.query.filter_by(is_active=True).count()
    total_departments = Department.query.filter_by(is_active=True).count()
    
    # Recent activity items
    recent_apps = Application.query.order_by(Application.created_at.desc()).limit(5).all()
    recent_reports = CommunityReport.query.order_by(CommunityReport.created_at.desc()).limit(5).all()
    recent_complaints = Complaint.query.order_by(Complaint.created_at.desc()).limit(5).all()
    
    # Breakdown data for charts
    # 1. Applications by category / service
    services = Service.query.all()
    apps_by_service = []
    for s in services[:8]:
        count = Application.query.filter_by(service_id=s.id).count()
        if count > 0 or len(apps_by_service) < 5:
            apps_by_service.append({'name': s.name, 'count': count})
            
    # 2. Reports by category
    report_categories = [
        'Roads & Transport', 'Waste & Sanitation', 'Street Lighting', 
        'Drainage & Flood', 'Water Supply', 'Public Facilities', 'Other'
    ]
    reports_by_category = []
    for cat in report_categories:
        count = CommunityReport.query.filter_by(category=cat).count()
        reports_by_category.append({'category': cat, 'count': count})
        
    # 3. Complaints by category
    complaint_categories = ['Service Delay', 'Staff Conduct', 'Application Issue', 'Fee Issue', 'Other']
    complaints_by_category = []
    for c_cat in complaint_categories:
        count = Complaint.query.filter_by(category=c_cat).count()
        complaints_by_category.append({'category': c_cat, 'count': count})
        
    return jsonify({
        'metrics': {
            'total_citizens': total_citizens,
            'total_staff': total_staff,
            'total_applications': total_applications,
            'pending_applications': pending_applications,
            'approved_applications': approved_applications,
            'completed_applications': completed_applications,
            'total_complaints': total_complaints,
            'active_complaints': active_complaints,
            'resolved_complaints': resolved_complaints,
            'total_reports': total_reports,
            'active_reports': active_reports,
            'resolved_reports': resolved_reports,
            'total_services': total_services,
            'total_departments': total_departments
        },
        'charts': {
            'apps_by_service': apps_by_service,
            'reports_by_category': reports_by_category,
            'complaints_by_category': complaints_by_category
        },
        'recent_applications': [a.to_dict() for a in recent_apps],
        'recent_reports': [r.to_dict() for r in recent_reports],
        'recent_complaints': [c.to_dict() for c in recent_complaints]
    }), 200

@admin_bp.route('/users', methods=['GET'])
@roles_accepted('admin')
def list_users(current_user):
    role = request.args.get('role')
    search = request.args.get('search')
    department_id = request.args.get('department_id')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))
    
    query = User.query
    
    if role and role.lower() != 'all':
        query = query.filter_by(role=role)
        
    if department_id:
        query = query.filter_by(department_id=department_id)
        
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (User.full_name.ilike(search_term)) |
            (User.email.ilike(search_term)) |
            (User.phone.ilike(search_term)) |
            (User.community_area.ilike(search_term))
        )
        
    total = query.count()
    users = query.order_by(User.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()
    
    return jsonify({
        'total': total,
        'page': page,
        'per_page': per_page,
        'users': [u.to_dict() for u in users]
    }), 200

@admin_bp.route('/users', methods=['POST'])
@roles_accepted('admin')
def create_staff_user(current_user):
    data = request.get_json() or {}
    
    full_name = data.get('full_name', '').strip()
    email = data.get('email', '').strip().lower()
    phone = data.get('phone', '').strip()
    password = data.get('password', '')
    role = data.get('role', 'staff')
    department_id = data.get('department_id')
    
    if not full_name or not email or not password:
        return jsonify({'error': 'Full name, email, and password are required.'}), 400
        
    if role not in ['staff', 'admin']:
        return jsonify({'error': 'Role must be staff or admin.'}), 400
        
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email address already exists.'}), 409
        
    if department_id:
        dept = Department.query.get(department_id)
        if not dept:
            return jsonify({'error': 'Selected department does not exist.'}), 404
            
    user = User(
        full_name=full_name,
        email=email,
        phone=phone,
        role=role,
        department_id=department_id,
        community_area='Isara-Remo Secretariat',
        is_active=True
    )
    user.set_password(password)
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({
        'message': f'Staff member {full_name} created successfully.',
        'user': user.to_dict()
    }), 201

@admin_bp.route('/users/<int:user_id>/status', methods=['PUT'])
@roles_accepted('admin')
def toggle_user_status(current_user, user_id):
    if current_user.id == user_id:
        return jsonify({'error': 'You cannot deactivate your own administrator account.'}), 400
        
    user = User.query.get_or_404(user_id)
    user.is_active = not user.is_active
    db.session.commit()
    
    status_str = "activated" if user.is_active else "suspended"
    return jsonify({
        'message': f'User account has been {status_str}.',
        'is_active': user.is_active
    }), 200

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@roles_accepted('admin')
def update_user_details(current_user, user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json() or {}
    
    if 'full_name' in data:
        user.full_name = data['full_name'].strip()
    if 'phone' in data:
        user.phone = data['phone'].strip()
    if 'department_id' in data:
        user.department_id = data['department_id']
    if 'community_area' in data:
        user.community_area = data['community_area'].strip()
    if 'password' in data and data['password']:
        if len(data['password']) < 6:
            return jsonify({'error': 'Password must be at least 6 characters.'}), 400
        user.set_password(data['password'])
        
    db.session.commit()
    return jsonify({
        'message': 'User details updated successfully.',
        'user': user.to_dict()
    }), 200
