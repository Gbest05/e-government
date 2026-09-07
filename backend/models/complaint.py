from datetime import datetime
from database import db

class Complaint(db.Model):
    __tablename__ = 'complaints'

    id = db.Column(db.Integer, primary_key=True)
    reference_code = db.Column(db.String(50), unique=True, nullable=False, index=True)
    citizen_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)

    subject = db.Column(db.String(150), nullable=False)
    category = db.Column(db.String(60), nullable=False)  # Service Delay, Staff Conduct, Application Issue, Fee Issue, Other
    description = db.Column(db.Text, nullable=False)
    related_application_ref = db.Column(db.String(50), nullable=True)
    document_url = db.Column(db.String(255), nullable=True)

    status = db.Column(db.String(30), default='Submitted', nullable=False)  # Submitted, Under Review, Assigned, In Progress, Resolved, Closed
    assigned_department_id = db.Column(db.Integer, db.ForeignKey('departments.id', ondelete='SET NULL'), nullable=True)
    assigned_staff_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)

    resolution_notes = db.Column(db.Text, nullable=True)
    resolved_at = db.Column(db.DateTime, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    assigned_staff = db.relationship('User', foreign_keys=[assigned_staff_id])
    updates = db.relationship('ComplaintUpdate', backref='complaint', lazy=True, cascade='all, delete-orphan', order_by='ComplaintUpdate.created_at.desc()')

    def to_dict(self):
        return {
            'id': self.id,
            'reference_code': self.reference_code,
            'citizen_id': self.citizen_id,
            'citizen_name': self.complainant.full_name if self.complainant else 'Citizen',
            'citizen_email': self.complainant.email if self.complainant else '',
            'citizen_phone': self.complainant.phone if self.complainant else '',
            'subject': self.subject,
            'category': self.category,
            'description': self.description,
            'related_application_ref': self.related_application_ref,
            'document_url': self.document_url,
            'status': self.status,
            'assigned_department_id': self.assigned_department_id,
            'assigned_department_name': self.assigned_department.name if self.assigned_department else 'General Administration',
            'assigned_staff_id': self.assigned_staff_id,
            'assigned_staff_name': self.assigned_staff.full_name if self.assigned_staff else 'Unassigned',
            'resolution_notes': self.resolution_notes,
            'resolved_at': self.resolved_at.isoformat() if self.resolved_at else None,
            'updates': [u.to_dict() for u in self.updates],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class ComplaintUpdate(db.Model):
    __tablename__ = 'complaint_updates'

    id = db.Column(db.Integer, primary_key=True)
    complaint_id = db.Column(db.Integer, db.ForeignKey('complaints.id', ondelete='CASCADE'), nullable=False)
    status = db.Column(db.String(30), nullable=False)
    comment = db.Column(db.Text, nullable=False)
    updated_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    updated_by = db.relationship('User', foreign_keys=[updated_by_user_id])

    def to_dict(self):
        return {
            'id': self.id,
            'complaint_id': self.complaint_id,
            'status': self.status,
            'comment': self.comment,
            'updated_by_name': self.updated_by.full_name if self.updated_by else 'Reviewing Officer',
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
