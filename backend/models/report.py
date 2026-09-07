from datetime import datetime
from database import db

class CommunityReport(db.Model):
    __tablename__ = 'community_reports'

    id = db.Column(db.Integer, primary_key=True)
    reference_code = db.Column(db.String(50), unique=True, nullable=False, index=True)
    citizen_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)

    title = db.Column(db.String(150), nullable=False)
    category = db.Column(db.String(60), nullable=False)  # Roads & Transport, Waste & Sanitation, Street Lighting, Drainage & Flood, Water Supply, Public Facilities, Other
    description = db.Column(db.Text, nullable=False)
    location_name = db.Column(db.String(255), nullable=False)
    community_area = db.Column(db.String(100), nullable=False)  # e.g., Isara-Remo, Ode-Remo, Ipara, Akaka
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    image_url = db.Column(db.String(255), nullable=True)

    reporter_name = db.Column(db.String(120), nullable=True)
    reporter_phone = db.Column(db.String(30), nullable=True)

    status = db.Column(db.String(30), default='Submitted', nullable=False)  # Submitted, Under Review, Assigned, In Progress, Resolved
    assigned_department_id = db.Column(db.Integer, db.ForeignKey('departments.id', ondelete='SET NULL'), nullable=True)
    assigned_staff_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)

    resolution_notes = db.Column(db.Text, nullable=True)
    resolution_image_url = db.Column(db.String(255), nullable=True)
    resolved_at = db.Column(db.DateTime, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    assigned_staff = db.relationship('User', foreign_keys=[assigned_staff_id])
    updates = db.relationship('CommunityReportUpdate', backref='report', lazy=True, cascade='all, delete-orphan', order_by='CommunityReportUpdate.created_at.desc()')

    def to_dict(self):
        return {
            'id': self.id,
            'reference_code': self.reference_code,
            'citizen_id': self.citizen_id,
            'title': self.title,
            'category': self.category,
            'description': self.description,
            'location_name': self.location_name,
            'community_area': self.community_area,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'image_url': self.image_url,
            'reporter_name': self.reporter_name or (self.author.full_name if self.author else 'Anonymous Citizen'),
            'reporter_phone': self.reporter_phone or (self.author.phone if self.author else None),
            'status': self.status,
            'assigned_department_id': self.assigned_department_id,
            'assigned_department_name': self.assigned_department.name if self.assigned_department else 'Unassigned',
            'assigned_staff_id': self.assigned_staff_id,
            'assigned_staff_name': self.assigned_staff.full_name if self.assigned_staff else 'Unassigned',
            'resolution_notes': self.resolution_notes,
            'resolution_image_url': self.resolution_image_url,
            'resolved_at': self.resolved_at.isoformat() if self.resolved_at else None,
            'updates': [u.to_dict() for u in self.updates],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class CommunityReportUpdate(db.Model):
    __tablename__ = 'community_report_updates'

    id = db.Column(db.Integer, primary_key=True)
    report_id = db.Column(db.Integer, db.ForeignKey('community_reports.id', ondelete='CASCADE'), nullable=False)
    status = db.Column(db.String(30), nullable=False)
    comment = db.Column(db.Text, nullable=False)
    updated_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    updated_by = db.relationship('User', foreign_keys=[updated_by_user_id])

    def to_dict(self):
        return {
            'id': self.id,
            'report_id': self.report_id,
            'status': self.status,
            'comment': self.comment,
            'updated_by_name': self.updated_by.full_name if self.updated_by else 'System / Officer',
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
