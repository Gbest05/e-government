import json
import random
from datetime import datetime
from flask import Blueprint, request, jsonify
from database import db
from models.application import Application, ApplicationDocument, ApplicationStatusHistory
from models.service import Service
from models.notification import Notification
from middleware.auth_middleware import jwt_required_custom, roles_accepted

application_bp = Blueprint('application_bp', __name__)

def generate_reference_number():
    year = datetime.utcnow().year
    random_num = random.randint(10000, 99999)
    ref = f"RMN-{year}-{random_num}"
    # Ensure uniqueness
    while Application.query.filter_by(reference_number=ref).first() is not None:
        random_num = random.randint(10000, 99999)
        ref = f"RMN-{year}-{random_num}"
    return ref

@application_bp.route('', methods=['POST'])
@jwt_required_custom
def submit_application(current_user):
    data = request.get_json() or {}
    
    service_id = data.get('service_id')
    if not service_id:
        return jsonify({'error': 'Service ID is required.'}), 400
        
    service = Service.query.get(service_id)
    if not service or not service.is_active:
        return jsonify({'error': 'Selected service is currently unavailable.'}), 404
        
    applicant_name = data.get('applicant_name', '').strip() or current_user.full_name
    applicant_phone = data.get('applicant_phone', '').strip() or current_user.phone or ''
    applicant_email = data.get('applicant_email', '').strip() or current_user.email
    applicant_address = data.get('applicant_address', '').strip() or current_user.address or ''
    community_area = data.get('community_area', '').strip() or current_user.community_area or 'Isara-Remo'
    
    if not applicant_name or not applicant_phone or not applicant_email:
        return jsonify({'error': 'Applicant name, phone, and email are required.'}), 400
        
    ref_num = generate_reference_number()
    form_data = data.get('form_data', {})
    
    application = Application(
        reference_number=ref_num,
        citizen_id=current_user.id,
        service_id=service.id,
        department_id=service.department_id,
        applicant_name=applicant_name,
        applicant_phone=applicant_phone,
        applicant_email=applicant_email,
        applicant_address=applicant_address,
        community_area=community_area,
        form_data_json=json.dumps(form_data),
        status='Submitted',
        current_step_index=0,
        priority=data.get('priority', 'Normal')
    )
    
    db.session.add(application)
    db.session.flush()  # to get application.id
    
    # Save attached documents if provided
    documents = data.get('documents', [])
    for doc in documents:
        if doc.get('url') and doc.get('name'):
            app_doc = ApplicationDocument(
                application_id=application.id,
                document_name=doc.get('name'),
                file_url=doc.get('url'),
                file_type=doc.get('file_type', 'pdf')
            )
            db.session.add(app_doc)
            
    # Initial status history entry
    history = ApplicationStatusHistory(
        application_id=application.id,
        status='Submitted',
        notes='Application successfully submitted by citizen via the e-government portal.',
        changed_by_user_id=current_user.id
    )
    db.session.add(history)
    
    # Citizen notification
    notif = Notification(
        user_id=current_user.id,
        title=f"Application Received: {service.name}",
        message=f"Your application has been received with reference number {ref_num}. It has been forwarded to the {service.department.name} department for verification.",
        notification_type="application",
        related_entity_type="application",
        related_entity_id=application.id
    )
    db.session.add(notif)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Application submitted successfully!',
        'reference_number': ref_num,
        'application': application.to_dict()
    }), 201

@application_bp.route('', methods=['GET'])
@jwt_required_custom
def list_applications(current_user):
    status = request.args.get('status')
    department_id = request.args.get('department_id')
    search = request.args.get('search')
    service_id = request.args.get('service_id')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))
    
    query = Application.query
    
    # Role-based scoping
    if current_user.role == 'citizen':
        query = query.filter_by(citizen_id=current_user.id)
    elif current_user.role == 'staff':
        # Staff can see applications in their department or assigned to them
        if current_user.department_id:
            query = query.filter(
                (Application.department_id == current_user.department_id) | 
                (Application.assigned_staff_id == current_user.id)
            )
    # Admin can see all applications
    
    if status and status.lower() != 'all':
        query = query.filter_by(status=status)
        
    if department_id and current_user.role == 'admin':
        query = query.filter_by(department_id=department_id)
        
    if service_id:
        query = query.filter_by(service_id=service_id)
        
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Application.reference_number.ilike(search_term)) | 
            (Application.applicant_name.ilike(search_term)) | 
            (Application.applicant_phone.ilike(search_term))
        )
        
    total = query.count()
    applications = query.order_by(Application.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()
    
    return jsonify({
        'total': total,
        'page': page,
        'per_page': per_page,
        'total_pages': (total + per_page - 1) // per_page,
        'applications': [a.to_dict() for a in applications]
    }), 200

@application_bp.route('/<int:app_id>', methods=['GET'])
@jwt_required_custom
def get_application_detail(current_user, app_id):
    application = Application.query.get_or_404(app_id)
    
    # Authorization check
    if current_user.role == 'citizen' and application.citizen_id != current_user.id:
        return jsonify({'error': 'You are not authorized to view this application.'}), 403
        
    return jsonify({'application': application.to_dict()}), 200

@application_bp.route('/track/<string:ref_code>', methods=['GET'])
def public_track_application(ref_code):
    """Public endpoint for tracking application status with zero sensitive citizen PII exposed"""
    ref_code = ref_code.strip()
    application = Application.query.filter_by(reference_number=ref_code).first()
    if not application:
        return jsonify({'error': f'No application found with reference code "{ref_code}". Please verify your reference number.'}), 404
        
    return jsonify({'application': application.to_public_dict()}), 200

@application_bp.route('/<int:app_id>/status', methods=['PUT'])
@roles_accepted('admin', 'staff')
def update_application_status(current_user, app_id):
    application = Application.query.get_or_404(app_id)
    data = request.get_json() or {}
    
    new_status = data.get('status')
    valid_statuses = ['Submitted', 'Under Review', 'Processing', 'Approved', 'Rejected', 'Completed']
    if new_status not in valid_statuses:
        return jsonify({'error': f'Invalid status. Allowed values: {", ".join(valid_statuses)}'}), 400
        
    notes = data.get('notes', '').strip()
    rejection_reason = data.get('rejection_reason', '').strip()
    
    application.status = new_status
    if notes:
        application.staff_notes = notes
    if rejection_reason:
        application.rejection_reason = rejection_reason
        
    # Map status to step index
    step_mapping = {
        'Submitted': 0,
        'Under Review': 1,
        'Processing': 2,
        'Approved': 3,
        'Rejected': 3,
        'Completed': 4
    }
    application.current_step_index = step_mapping.get(new_status, 0)
    
    # If approved, generate digital certificate / verification slip code
    if new_status in ['Approved', 'Completed'] and not application.certificate_code:
        application.certificate_code = f"CERT-RMN-{random.randint(100000, 999999)}"
        
    # Record in history
    history = ApplicationStatusHistory(
        application_id=application.id,
        status=new_status,
        notes=notes or f"Application status updated to {new_status} by {current_user.full_name}.",
        changed_by_user_id=current_user.id
    )
    db.session.add(history)
    
    # Notify citizen
    citizen_notif = Notification(
        user_id=application.citizen_id,
        title=f"Application Update: {application.reference_number}",
        message=f"Your application for '{application.service.name}' is now '{new_status}'. {notes if notes else ''}",
        notification_type="application",
        related_entity_type="application",
        related_entity_id=application.id
    )
    db.session.add(citizen_notif)
    
    db.session.commit()
    
    return jsonify({
        'message': f'Application status successfully updated to {new_status}.',
        'application': application.to_dict()
    }), 200

@application_bp.route('/<int:app_id>/assign', methods=['PUT'])
@roles_accepted('admin', 'staff')
def assign_application(current_user, app_id):
    application = Application.query.get_or_404(app_id)
    data = request.get_json() or {}
    
    staff_id = data.get('staff_id')
    department_id = data.get('department_id')
    
    if department_id:
        application.department_id = department_id
    if staff_id:
        application.assigned_staff_id = staff_id
        
    db.session.commit()
    return jsonify({
        'message': 'Application assignment updated.',
        'application': application.to_dict()
    }), 200
