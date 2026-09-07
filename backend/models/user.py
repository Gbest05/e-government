from datetime import datetime
from database import db
from flask_bcrypt import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    phone = db.Column(db.String(30), nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='citizen')  # 'admin', 'staff', 'citizen'
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id', ondelete='SET NULL'), nullable=True)
    address = db.Column(db.String(255), nullable=True)
    community_area = db.Column(db.String(100), nullable=True)  # e.g., Isara-Remo, Ode-Remo, Ipara, Akaka
    profile_image = db.Column(db.String(255), nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    department = db.relationship('Department', backref=db.backref('staff_members', lazy=True))
    applications = db.relationship('Application', foreign_keys='Application.citizen_id', backref='applicant', lazy=True)
    assigned_applications = db.relationship('Application', foreign_keys='Application.assigned_staff_id', backref='assigned_staff', lazy=True)
    community_reports = db.relationship('CommunityReport', foreign_keys='CommunityReport.citizen_id', backref='author', lazy=True)
    complaints = db.relationship('Complaint', foreign_keys='Complaint.citizen_id', backref='complainant', lazy=True)
    notifications = db.relationship('Notification', backref='recipient', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self, include_sensitive=False):
        data = {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'phone': self.phone,
            'role': self.role,
            'department_id': self.department_id,
            'department_name': self.department.name if self.department else None,
            'address': self.address,
            'community_area': self.community_area,
            'profile_image': self.profile_image,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        return data
