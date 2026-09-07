from flask import Blueprint, request, jsonify
from database import db
from models.user import User
from models.notification import Notification
from middleware.auth_middleware import create_jwt_token, jwt_required_custom

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    
    # Required validation
    full_name = data.get('full_name', '').strip()
    email = data.get('email', '').strip().lower()
    phone = data.get('phone', '').strip()
    password = data.get('password', '')
    address = data.get('address', '').strip()
    community_area = data.get('community_area', '').strip()
    
    if not full_name or not email or not password:
        return jsonify({'error': 'Full name, email, and password are required.'}), 400
    
    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters long.'}), 400
    
    # Check if email exists
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'An account with this email address already exists.'}), 409
    
    # Create new citizen account
    new_user = User(
        full_name=full_name,
        email=email,
        phone=phone,
        role='citizen',
        address=address,
        community_area=community_area or 'Isara-Remo',
        is_active=True
    )
    new_user.set_password(password)
    
    db.session.add(new_user)
    db.session.commit()
    
    # Create welcoming notification
    welcome_notif = Notification(
        user_id=new_user.id,
        title="Welcome to Remo North E-Government Platform",
        message=f"Hello {full_name}, your citizen account has been successfully created. You can now access services, submit applications, and report issues in Remo North.",
        notification_type="system"
    )
    db.session.add(welcome_notif)
    db.session.commit()
    
    token = create_jwt_token(new_user)
    return jsonify({
        'message': 'Registration successful. Welcome to Remo North Digital Services!',
        'token': token,
        'user': new_user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email_or_phone = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    if not email_or_phone or not password:
        return jsonify({'error': 'Email/Phone and password are required.'}), 400
    
    # Lookup by email or phone
    user = User.query.filter((User.email == email_or_phone) | (User.phone == email_or_phone)).first()
    
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials. Please verify your email and password.'}), 401
    
    if not user.is_active:
        return jsonify({'error': 'Your account has been deactivated. Please contact the council administrator.'}), 403
    
    token = create_jwt_token(user)
    return jsonify({
        'message': f'Welcome back, {user.full_name}!',
        'token': token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required_custom
def get_current_user(current_user):
    return jsonify({'user': current_user.to_dict()}), 200

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required_custom
def update_profile(current_user):
    data = request.get_json() or {}
    
    if 'full_name' in data:
        current_user.full_name = data['full_name'].strip()
    if 'phone' in data:
        current_user.phone = data['phone'].strip()
    if 'address' in data:
        current_user.address = data['address'].strip()
    if 'community_area' in data:
        current_user.community_area = data['community_area'].strip()
    if 'profile_image' in data:
        current_user.profile_image = data['profile_image']
        
    db.session.commit()
    return jsonify({
        'message': 'Profile updated successfully.',
        'user': current_user.to_dict()
    }), 200

@auth_bp.route('/change-password', methods=['PUT'])
@jwt_required_custom
def change_password(current_user):
    data = request.get_json() or {}
    current_password = data.get('current_password', '')
    new_password = data.get('new_password', '')
    
    if not current_password or not new_password:
        return jsonify({'error': 'Current password and new password are required.'}), 400
    
    if not current_user.check_password(current_password):
        return jsonify({'error': 'Current password is incorrect.'}), 400
    
    if len(new_password) < 6:
        return jsonify({'error': 'New password must be at least 6 characters long.'}), 400
    
    current_user.set_password(new_password)
    db.session.commit()
    
    return jsonify({'message': 'Password changed successfully.'}), 200
