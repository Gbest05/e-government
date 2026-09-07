import json
from datetime import datetime
from database import db

class Application(db.Model):
    __tablename__ = 'applications'

    id = db.Column(db.Integer, primary_key=True)
    reference_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    citizen_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id', ondelete='RESTRICT'), nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id', ondelete='RESTRICT'), nullable=False)
    assigned_staff_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)

    applicant_name = db.Column(db.String(120), nullable=False)
    applicant_phone = db.Column(db.String(30), nullable=False)
    applicant_email = db.Column(db.String(120), nullable=False)
    applicant_address = db.Column(db.String(255), nullable=True)
    community_area = db.Column(db.String(100), nullable=True)

    form_data_json = db.Column(db.Text, default='{}')
    status = db.Column(db.String(30), default='Submitted', nullable=False)  # Submitted, Under Review, Processing, Approved, Rejected, Completed
    current_step_index = db.Column(db.Integer, default=0, nullable=False)
    priority = db.Column(db.String(20), default='Normal')
    staff_notes = db.Column(db.Text, nullable=True)
    rejection_reason = db.Column(db.Text, nullable=True)
    certificate_code = db.Column(db.String(60), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    documents = db.relationship('ApplicationDocument', backref='application', lazy=True, cascade='all, delete-orphan')
    status_history = db.relationship('ApplicationStatusHistory', backref='application', lazy=True, cascade='all, delete-orphan', order_by='ApplicationStatusHistory.created_at.desc()')

    def get_form_data(self):
        try:
            return json.loads(self.form_data_json) if self.form_data_json else {}
        except Exception:
            return {}

    def to_dict(self):
        return {
            'id': self.id,
            'reference_number': self.reference_number,
            'citizen_id': self.citizen_id,
            'service_id': self.service_id,
            'service_name': self.service.name if self.service else 'Unknown Service',
            'service_code': self.service.code if self.service else '',
            'service_category': self.service.category if self.service else '',
            'department_id': self.department_id,
            'department_name': self.department.name if self.department else 'Unknown Department',
            'assigned_staff_id': self.assigned_staff_id,
            'assigned_staff_name': self.assigned_staff.full_name if self.assigned_staff else 'Unassigned',
            'applicant_name': self.applicant_name,
            'applicant_phone': self.applicant_phone,
            'applicant_email': self.applicant_email,
            'applicant_address': self.applicant_address,
            'community_area': self.community_area,
            'form_data': self.get_form_data(),
            'status': self.status,
            'current_step_index': self.current_step_index,
            'processing_steps': self.service.get_processing_steps() if self.service else ["Submitted", "Under Review", "Processing", "Approved / Rejected", "Completed"],
            'priority': self.priority,
            'staff_notes': self.staff_notes,
            'rejection_reason': self.rejection_reason,
            'certificate_code': self.certificate_code,
            'fee_naira': self.service.fee_naira if self.service else 0,
            'expected_days': self.service.expected_days if self.service else 3,
            'documents': [doc.to_dict() for doc in self.documents],
            'status_history': [h.to_dict() for h in self.status_history],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def to_public_dict(self):
        """Safe sanitized version for public tracking page with zero confidential citizen PII exposed"""
        return {
            'reference_number': self.reference_number,
            'service_name': self.service.name if self.service else 'Government Service',
            'department_name': self.department.name if self.department else 'Local Council',
            'status': self.status,
            'current_step_index': self.current_step_index,
            'processing_steps': self.service.get_processing_steps() if self.service else ["Submitted", "Under Review", "Processing", "Approved / Rejected", "Completed"],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'certificate_code': self.certificate_code if self.status == 'Approved' or self.status == 'Completed' else None,
            'status_history': [
                {
                    'status': h.status,
                    'notes': h.notes,
                    'created_at': h.created_at.isoformat()
                } for h in self.status_history
            ]
        }

class ApplicationDocument(db.Model):
    __tablename__ = 'application_documents'

    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('applications.id', ondelete='CASCADE'), nullable=False)
    document_name = db.Column(db.String(120), nullable=False)
    file_url = db.Column(db.String(255), nullable=False)
    file_type = db.Column(db.String(50), nullable=True)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'application_id': self.application_id,
            'document_name': self.document_name,
            'file_url': self.file_url,
            'file_type': self.file_type,
            'uploaded_at': self.uploaded_at.isoformat() if self.uploaded_at else None
        }

class ApplicationStatusHistory(db.Model):
    __tablename__ = 'application_status_history'

    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('applications.id', ondelete='CASCADE'), nullable=False)
    status = db.Column(db.String(30), nullable=False)
    notes = db.Column(db.Text, nullable=True)
    changed_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    changed_by = db.relationship('User', foreign_keys=[changed_by_user_id])

    def to_dict(self):
        return {
            'id': self.id,
            'application_id': self.application_id,
            'status': self.status,
            'notes': self.notes,
            'changed_by_name': self.changed_by.full_name if self.changed_by else 'System',
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
