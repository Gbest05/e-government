from flask import Blueprint, jsonify
from database import db
from models.application import Application
from models.report import CommunityReport
from models.complaint import Complaint
from middleware.auth_middleware import roles_accepted

staff_bp = Blueprint('staff_bp', __name__)

@staff_bp.route('/dashboard', methods=['GET'])
@roles_accepted('staff', 'admin')
def get_staff_dashboard(current_user):
    dept_id = current_user.department_id
    
    # Applications assigned to this staff or belonging to their department
    app_query = Application.query
    if current_user.role == 'staff' and dept_id:
        app_query = app_query.filter(
            (Application.department_id == dept_id) | (Application.assigned_staff_id == current_user.id)
        )
        
    total_assigned_apps = app_query.count()
    pending_apps = app_query.filter(Application.status.in_(['Submitted', 'Under Review'])).count()
    processing_apps = app_query.filter_by(status='Processing').count()
    completed_apps = app_query.filter(Application.status.in_(['Approved', 'Completed'])).count()
    
    # Community reports
    rep_query = CommunityReport.query
    if current_user.role == 'staff' and dept_id:
        rep_query = rep_query.filter(
            (CommunityReport.assigned_department_id == dept_id) | (CommunityReport.assigned_staff_id == current_user.id)
        )
    active_reports = rep_query.filter(CommunityReport.status != 'Resolved').count()
    resolved_reports = rep_query.filter_by(status='Resolved').count()
    
    # Complaints
    comp_query = Complaint.query
    if current_user.role == 'staff' and dept_id:
        comp_query = comp_query.filter(
            (Complaint.assigned_department_id == dept_id) | (Complaint.assigned_staff_id == current_user.id)
        )
    active_complaints = comp_query.filter(Complaint.status.in_(['Submitted', 'Under Review', 'Assigned', 'In Progress'])).count()
    
    # Recent queue items
    recent_assigned_apps = app_query.order_by(Application.updated_at.desc()).limit(5).all()
    recent_reports = rep_query.order_by(CommunityReport.created_at.desc()).limit(5).all()
    
    return jsonify({
        'metrics': {
            'total_cases': total_assigned_apps,
            'pending_cases': pending_apps,
            'in_progress_cases': processing_apps,
            'completed_cases': completed_apps,
            'active_reports': active_reports,
            'resolved_reports': resolved_reports,
            'active_complaints': active_complaints
        },
        'department_name': current_user.department.name if current_user.department else 'Council Administration',
        'recent_applications': [a.to_dict() for a in recent_assigned_apps],
        'recent_reports': [r.to_dict() for r in recent_reports]
    }), 200
