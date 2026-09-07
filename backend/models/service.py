import json
from datetime import datetime
from database import db

class Service(db.Model):
    __tablename__ = 'services'

    id = db.Column(db.Integer, primary_key=True)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(150), nullable=False)
    code = db.Column(db.String(30), unique=True, nullable=False)
    category = db.Column(db.String(60), nullable=False)  # Certificates, Business & Trade, Infrastructure, Health, Community
    short_description = db.Column(db.String(255), nullable=False)
    full_description = db.Column(db.Text, nullable=True)
    eligibility = db.Column(db.Text, nullable=True)
    requirements_json = db.Column(db.Text, default='[]')  # JSON array of strings
    required_documents_json = db.Column(db.Text, default='[]')  # JSON array of strings
    processing_steps_json = db.Column(db.Text, default='[]')  # JSON array of step titles
    fee_naira = db.Column(db.Float, default=0.0, nullable=False)
    expected_days = db.Column(db.Integer, default=3, nullable=False)
    icon_name = db.Column(db.String(50), default='FileText')
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    applications = db.relationship('Application', backref='service', lazy=True)
    requirements = db.relationship('ServiceRequirement', backref='service', lazy=True, cascade='all, delete-orphan')

    def get_requirements(self):
        try:
            return json.loads(self.requirements_json) if self.requirements_json else []
        except Exception:
            return []

    def get_required_documents(self):
        try:
            return json.loads(self.required_documents_json) if self.required_documents_json else []
        except Exception:
            return []

    def get_processing_steps(self):
        try:
            return json.loads(self.processing_steps_json) if self.processing_steps_json else []
        except Exception:
            return ["Submit Application", "Under Review", "Processing", "Approved / Rejected", "Completed"]

    def to_dict(self):
        return {
            'id': self.id,
            'department_id': self.department_id,
            'department_name': self.department.name if self.department else None,
            'name': self.name,
            'code': self.code,
            'category': self.category,
            'short_description': self.short_description,
            'full_description': self.full_description,
            'eligibility': self.eligibility,
            'requirements': self.get_requirements(),
            'required_documents': self.get_required_documents(),
            'processing_steps': self.get_processing_steps(),
            'fee_naira': self.fee_naira,
            'expected_days': self.expected_days,
            'icon_name': self.icon_name,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class ServiceRequirement(db.Model):
    __tablename__ = 'service_requirements'

    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    is_mandatory = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            'id': self.id,
            'service_id': self.service_id,
            'title': self.title,
            'description': self.description,
            'is_mandatory': self.is_mandatory
        }
