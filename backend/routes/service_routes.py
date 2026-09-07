import json
from flask import Blueprint, request, jsonify
from database import db
from models.service import Service, ServiceRequirement
from models.department import Department
from middleware.auth_middleware import roles_accepted

service_bp = Blueprint('service_bp', __name__)

@service_bp.route('', methods=['GET'])
def get_services():
    category = request.args.get('category')
    search = request.args.get('search')
    department_id = request.args.get('department_id')
    all_statuses = request.args.get('all') == 'true'  # For admin to see inactive
    
    query = Service.query
    
    if not all_statuses:
        query = query.filter_by(is_active=True)
        
    if category and category.lower() != 'all':
        query = query.filter(Service.category.ilike(f"%{category}%"))
        
    if department_id:
        query = query.filter_by(department_id=department_id)
        
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Service.name.ilike(search_term)) | 
            (Service.short_description.ilike(search_term)) | 
            (Service.code.ilike(search_term))
        )
        
    services = query.order_by(Service.name.asc()).all()
    return jsonify({
        'count': len(services),
        'services': [s.to_dict() for s in services]
    }), 200

@service_bp.route('/<int:service_id>', methods=['GET'])
def get_service_detail(service_id):
    service = Service.query.get_or_404(service_id)
    return jsonify({'service': service.to_dict()}), 200

@service_bp.route('', methods=['POST'])
@roles_accepted('admin')
def create_service(current_user):
    data = request.get_json() or {}
    
    name = data.get('name', '').strip()
    code = data.get('code', '').strip().upper()
    category = data.get('category', '').strip()
    department_id = data.get('department_id')
    short_description = data.get('short_description', '').strip()
    full_description = data.get('full_description', '').strip()
    eligibility = data.get('eligibility', '').strip()
    
    if not name or not code or not category or not department_id or not short_description:
        return jsonify({'error': 'Name, code, category, department_id, and short description are required.'}), 400
    
    if Service.query.filter_by(code=code).first():
        return jsonify({'error': f'A service with code {code} already exists.'}), 409
    
    dept = Department.query.get(department_id)
    if not dept:
        return jsonify({'error': 'Selected department does not exist.'}), 404
        
    requirements = data.get('requirements', [])
    required_docs = data.get('required_documents', [])
    processing_steps = data.get('processing_steps', [
        "Submit Application", "Under Review", "Processing", "Approved / Rejected", "Completed"
    ])
    
    new_service = Service(
        name=name,
        code=code,
        category=category,
        department_id=department_id,
        short_description=short_description,
        full_description=full_description,
        eligibility=eligibility,
        requirements_json=json.dumps(requirements),
        required_documents_json=json.dumps(required_docs),
        processing_steps_json=json.dumps(processing_steps),
        fee_naira=float(data.get('fee_naira', 0.0)),
        expected_days=int(data.get('expected_days', 3)),
        icon_name=data.get('icon_name', 'FileText'),
        is_active=data.get('is_active', True)
    )
    
    db.session.add(new_service)
    db.session.commit()
    
    return jsonify({
        'message': 'Government service created successfully.',
        'service': new_service.to_dict()
    }), 201

@service_bp.route('/<int:service_id>', methods=['PUT'])
@roles_accepted('admin')
def update_service(current_user, service_id):
    service = Service.query.get_or_404(service_id)
    data = request.get_json() or {}
    
    if 'name' in data:
        service.name = data['name'].strip()
    if 'category' in data:
        service.category = data['category'].strip()
    if 'department_id' in data:
        service.department_id = data['department_id']
    if 'short_description' in data:
        service.short_description = data['short_description'].strip()
    if 'full_description' in data:
        service.full_description = data['full_description'].strip()
    if 'eligibility' in data:
        service.eligibility = data['eligibility'].strip()
    if 'requirements' in data:
        service.requirements_json = json.dumps(data['requirements'])
    if 'required_documents' in data:
        service.required_documents_json = json.dumps(data['required_documents'])
    if 'processing_steps' in data:
        service.processing_steps_json = json.dumps(data['processing_steps'])
    if 'fee_naira' in data:
        service.fee_naira = float(data['fee_naira'])
    if 'expected_days' in data:
        service.expected_days = int(data['expected_days'])
    if 'icon_name' in data:
        service.icon_name = data['icon_name']
    if 'is_active' in data:
        service.is_active = bool(data['is_active'])
        
    db.session.commit()
    return jsonify({
        'message': 'Service updated successfully.',
        'service': service.to_dict()
    }), 200

@service_bp.route('/<int:service_id>', methods=['DELETE'])
@roles_accepted('admin')
def delete_service(current_user, service_id):
    service = Service.query.get_or_404(service_id)
    # Soft delete / toggle active
    service.is_active = not service.is_active
    db.session.commit()
    status_str = "activated" if service.is_active else "deactivated"
    return jsonify({
        'message': f'Service has been {status_str}.',
        'is_active': service.is_active
    }), 200
