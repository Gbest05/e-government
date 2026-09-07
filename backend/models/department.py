from datetime import datetime
from database import db

class Department(db.Model):
    __tablename__ = 'departments'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    code = db.Column(db.String(20), unique=True, nullable=False)  # e.g., 'WORKS', 'HEALTH', 'ADMIN'
    description = db.Column(db.Text, nullable=True)
    head_name = db.Column(db.String(120), nullable=True)
    contact_email = db.Column(db.String(120), nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    services = db.relationship('Service', backref='department', lazy=True, cascade='all, delete-orphan')
    applications = db.relationship('Application', backref='department', lazy=True)
    community_reports = db.relationship('CommunityReport', backref='assigned_department', lazy=True)
    complaints = db.relationship('Complaint', backref='assigned_department', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'description': self.description,
            'head_name': self.head_name,
            'contact_email': self.contact_email,
            'is_active': self.is_active,
            'staff_count': len([s for s in self.staff_members if s.is_active]) if hasattr(self, 'staff_members') else 0,
            'services_count': len([s for s in self.services if s.is_active]) if hasattr(self, 'services') else 0,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
