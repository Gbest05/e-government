from flask import Blueprint, request, jsonify
from database import db
from models.department import Department
from middleware.auth_middleware import roles_accepted

department_bp = Blueprint('department_bp', __name__)

@department_bp.route('', methods=['GET'])
def list_departments():
    all_records = request.args.get('all') == 'true'
    query = Department.query
    if not all_records:
        query = query.filter_by(is_active=True)
    departments = query.order_by(Department.name.asc()).all()
    return jsonify({
        'departments': [d.to_dict() for d in departments]
    }), 200

@department_bp.route('', methods=['POST'])
@roles_accepted('admin')
def create_department(current_user):
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    code = data.get('code', '').strip().upper()
    
    if not name or not code:
        return jsonify({'error': 'Department name and code are required.'}), 400
        
    if Department.query.filter((Department.name == name) | (Department.code == code)).first():
        return jsonify({'error': 'A department with this name or code already exists.'}), 409
        
    department = Department(
        name=name,
        code=code,
        description=data.get('description', '').strip(),
        head_name=data.get('head_name', '').strip(),
        contact_email=data.get('contact_email', '').strip(),
        is_active=data.get('is_active', True)
    )
    
    db.session.add(department)
    db.session.commit()
    
    return jsonify({
        'message': 'Department created successfully.',
        'department': department.to_dict()
    }), 201

@department_bp.route('/<int:dept_id>', methods=['PUT'])
@roles_accepted('admin')
def update_department(current_user, dept_id):
    department = Department.query.get_or_404(dept_id)
    data = request.get_json() or {}
    
    if 'name' in data:
        department.name = data['name'].strip()
    if 'code' in data:
        department.code = data['code'].strip().upper()
    if 'description' in data:
        department.description = data['description'].strip()
    if 'head_name' in data:
        department.head_name = data['head_name'].strip()
    if 'contact_email' in data:
        department.contact_email = data['contact_email'].strip()
    if 'is_active' in data:
        department.is_active = bool(data['is_active'])
        
    db.session.commit()
    return jsonify({
        'message': 'Department updated successfully.',
        'department': department.to_dict()
    }), 200

@department_bp.route('/<int:dept_id>', methods=['DELETE'])
@roles_accepted('admin')
def delete_department(current_user, dept_id):
    department = Department.query.get_or_404(dept_id)
    # Check if services or applications depend on it
    if department.services:
        department.is_active = False
        db.session.commit()
        return jsonify({'message': 'Department has active services; it has been deactivated rather than deleted.'}), 200
        
    db.session.delete(department)
    db.session.commit()
    return jsonify({'message': 'Department deleted successfully.'}), 200
