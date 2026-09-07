from datetime import datetime
from database import db

class Setting(db.Model):
    __tablename__ = 'settings'

    id = db.Column(db.Integer, primary_key=True)
    site_name = db.Column(db.String(150), nullable=False, default='Remo North Local Government')
    site_short_name = db.Column(db.String(50), nullable=False, default='REMO NORTH')
    logo_url = db.Column(db.String(500), nullable=True)
    hero_badge = db.Column(db.String(100), nullable=False, default='Official E-Government Portal')
    hero_title = db.Column(db.String(255), nullable=False, default='Empowering Remo North Through Modern Digital Governance')
    hero_subtitle = db.Column(db.Text, nullable=False, default='Access municipal services, submit statutory applications, report local infrastructure problems, and track approvals seamlessly from anywhere.')
    hero_cta_primary = db.Column(db.String(50), nullable=False, default='Explore All Services')
    hero_cta_secondary = db.Column(db.String(50), nullable=False, default='Report Community Issue')
    announcement_banner = db.Column(db.String(255), nullable=False, default='Official Portal of Remo North Local Government, Ogun State • Secretariat: Isara-Remo')
    secretariat_address = db.Column(db.String(255), nullable=False, default='Local Government Secretariat Complex, Palace Way, Isara-Remo')
    emergency_helpline = db.Column(db.String(50), nullable=False, default='0800-REMO-HELP')
    main_phone = db.Column(db.String(50), nullable=False, default='+234 (0) 803 111 2233')
    official_email = db.Column(db.String(120), nullable=False, default='info@remonorth.og.gov.ng')
    state_name = db.Column(db.String(100), nullable=False, default='Ogun State, Nigeria')
    about_summary = db.Column(db.Text, nullable=True, default='Remo North Local Government Area is an administrative hub in Ogun State with council headquarters situated in Isara-Remo.')
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'site_name': self.site_name,
            'site_short_name': self.site_short_name,
            'logo_url': self.logo_url,
            'hero_badge': self.hero_badge,
            'hero_title': self.hero_title,
            'hero_subtitle': self.hero_subtitle,
            'hero_cta_primary': self.hero_cta_primary,
            'hero_cta_secondary': self.hero_cta_secondary,
            'announcement_banner': self.announcement_banner,
            'secretariat_address': self.secretariat_address,
            'emergency_helpline': self.emergency_helpline,
            'main_phone': self.main_phone,
            'official_email': self.official_email,
            'state_name': self.state_name,
            'about_summary': self.about_summary,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
