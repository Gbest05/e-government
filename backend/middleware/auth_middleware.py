import jwt
from functools import wraps
from datetime import datetime, timedelta
from flask import request, jsonify, current_app
from models.user import User

def create_jwt_token(user):
    payload = {
        'sub': user.id,
        'email': user.email,
        'role': user.role,
        'full_name': user.full_name,
        'department_id': user.department_id,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + current_app.config.get('JWT_ACCESS_TOKEN_EXPIRES', timedelta(days=7))
    }
    secret = current_app.config.get('JWT_SECRET_KEY', 'remo-north-jwt-secret-key-2026-xyz')
    return jwt.encode(payload, secret, algorithm='HS256')

def decode_jwt_token(token):
    secret = current_app.config.get('JWT_SECRET_KEY', 'remo-north-jwt-secret-key-2026-xyz')
    try:
        payload = jwt.decode(token, secret, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def jwt_required_custom(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Missing authorization header'}), 401
        
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return jsonify({'error': 'Invalid authorization header format. Expected Bearer <token>'}), 401
        
        token = parts[1]
        payload = decode_jwt_token(token)
        if not payload:
            return jsonify({'error': 'Invalid or expired token. Please log in again.'}), 401
        
        user = User.query.get(payload.get('sub'))
        if not user:
            return jsonify({'error': 'User account associated with this token no longer exists.'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Account is suspended or deactivated. Contact council administrator.'}), 403
        
        return f(current_user=user, *args, **kwargs)
    return decorated

def roles_accepted(*roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                return jsonify({'error': 'Missing authorization header'}), 401
            
            parts = auth_header.split()
            if len(parts) != 2 or parts[0].lower() != 'bearer':
                return jsonify({'error': 'Invalid authorization header format'}), 401
            
            token = parts[1]
            payload = decode_jwt_token(token)
            if not payload:
                return jsonify({'error': 'Invalid or expired token'}), 401
            
            user = User.query.get(payload.get('sub'))
            if not user or not user.is_active:
                return jsonify({'error': 'User account inactive or not found'}), 403
            
            if user.role not in roles:
                return jsonify({
                    'error': f'Access forbidden: Role "{user.role}" does not have required permissions. Required: {", ".join(roles)}.'
                }), 403
            
            return f(current_user=user, *args, **kwargs)
        return decorated
    return decorator
