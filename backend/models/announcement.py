from datetime import datetime
from database import db

class Announcement(db.Model):
    __tablename__ = 'announcements'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(60), nullable=False, default='Public Notice')
    content = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    target_audience = db.Column(db.String(100), default='All Citizens', nullable=False)
    is_pinned = db.Column(db.Boolean, default=False, nullable=False)
    is_published = db.Column(db.Boolean, default=True, nullable=False)
    publish_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    expiry_date = db.Column(db.DateTime, nullable=True)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    author = db.relationship('User', foreign_keys=[author_id])

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'category': self.category,
            'content': self.content,
            'image_url': self.image_url,
            'target_audience': self.target_audience,
            'is_pinned': self.is_pinned,
            'is_published': self.is_published,
            'publish_date': self.publish_date.isoformat() if self.publish_date else None,
            'expiry_date': self.expiry_date.isoformat() if self.expiry_date else None,
            'author_name': self.author.full_name if self.author else 'Executive Secretariat',
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
