import json
from datetime import datetime, timedelta
from app import create_app
from database import db
from models.user import User
from models.department import Department
from models.service import Service
from models.application import Application, ApplicationDocument, ApplicationStatusHistory
from models.report import CommunityReport, CommunityReportUpdate
from models.complaint import Complaint, ComplaintUpdate
from models.announcement import Announcement
from models.notification import Notification
from models.setting import Setting

app = create_app()

def seed_database():
    with app.app_context():
        print("Clearing and rebuilding database schema...")
        db.drop_all()
        db.create_all()

        print("Seeding Remo North Local Government Departments...")
        depts_data = [
            {
                'name': 'Works and Infrastructure',
                'code': 'WORKS',
                'description': 'Maintains municipal roads, culverts, public drainage, municipal buildings, streetlights, and infrastructure rights of way.',
                'head_name': 'Engr. Babatunde Sowunmi',
                'contact_email': 'works@remonorth.og.gov.ng'
            },
            {
                'name': 'Primary Health Care and Environmental Services',
                'code': 'HEALTH',
                'description': 'Oversees local primary healthcare centres, maternal care, environmental hygiene, refuse management, and public food safety.',
                'head_name': 'Dr. Folashade Adebayo',
                'contact_email': 'health@remonorth.og.gov.ng'
            },
            {
                'name': 'General Administration and Human Resources',
                'code': 'ADMIN',
                'description': 'Coordinates council secretariat operations, legal services, public relations, council meetings, and citizen welfare.',
                'head_name': 'Mr. Kehinde Osoba',
                'contact_email': 'admin@remonorth.og.gov.ng'
            },
            {
                'name': 'Community Development and Social Welfare',
                'code': 'COMMUNITY',
                'description': 'Partners with Community Development Associations (CDAs), youth groups, market associations, and vulnerable citizens.',
                'head_name': 'Mrs. Toyin Oladipo',
                'contact_email': 'community@remonorth.og.gov.ng'
            },
            {
                'name': 'Agriculture and Rural Development',
                'code': 'AGRIC',
                'description': 'Supports rural farmers, agricultural extension services, grain reserves, cooperative societies, and produce inspections.',
                'head_name': 'Alhaji Rasheed Balogun',
                'contact_email': 'agric@remonorth.og.gov.ng'
            },
            {
                'name': 'Finance, Budget and Internal Revenue',
                'code': 'FINANCE',
                'description': 'Manages municipal revenue assessment, local business permits, market stall levies, and council financial accounting.',
                'head_name': 'Mr. Olawale Ogunjobi',
                'contact_email': 'finance@remonorth.og.gov.ng'
            },
            {
                'name': 'Information and Digital Technology (ICT)',
                'code': 'ICT',
                'description': 'Drives council modernization, e-government digital portals, citizen records digitization, and cybersecurity.',
                'head_name': 'Mr. Damilola Coker',
                'contact_email': 'ict@remonorth.og.gov.ng'
            }
        ]

        dept_objects = {}
        for d in depts_data:
            dept = Department(**d)
            db.session.add(dept)
            dept_objects[d['code']] = dept
        db.session.commit()

        print("Seeding Users (Administrator, Department Staff, and Citizens)...")
        # 1. Administrator
        admin_user = User(
            full_name='Hon. Olumide Adeleke',
            email='admin@remonorth.og.gov.ng',
            phone='08031112233',
            role='admin',
            department_id=dept_objects['ADMIN'].id,
            address='Remo North Local Government Secretariat, Isara-Remo',
            community_area='Isara-Remo',
            is_active=True
        )
        admin_user.set_password('Admin@Remo2026!')
        db.session.add(admin_user)

        # 2. Staff Members
        staff_works = User(
            full_name='Engr. Babatunde Sowunmi',
            email='works.staff@remonorth.og.gov.ng',
            phone='08034445566',
            role='staff',
            department_id=dept_objects['WORKS'].id,
            address='Department of Works, LG Secretariat, Isara-Remo',
            community_area='Isara-Remo',
            is_active=True
        )
        staff_works.set_password('Staff@Remo2026!')
        db.session.add(staff_works)

        staff_health = User(
            full_name='Dr. Folashade Adebayo',
            email='health.staff@remonorth.og.gov.ng',
            phone='08037778899',
            role='staff',
            department_id=dept_objects['HEALTH'].id,
            address='Primary Health Centre, Ode-Remo',
            community_area='Ode-Remo',
            is_active=True
        )
        staff_health.set_password('Staff@Remo2026!')
        db.session.add(staff_health)

        staff_admin = User(
            full_name='Mr. Kehinde Osoba',
            email='admin.staff@remonorth.og.gov.ng',
            phone='08023334455',
            role='staff',
            department_id=dept_objects['ADMIN'].id,
            address='Council Secretariat, Isara-Remo',
            community_area='Isara-Remo',
            is_active=True
        )
        staff_admin.set_password('Staff@Remo2026!')
        db.session.add(staff_admin)

        # 3. Citizens
        citizen_1 = User(
            full_name='Adekunle Bello',
            email='ade.bello@example.com',
            phone='08051234567',
            role='citizen',
            address='14 Palace Way, Ode-Remo',
            community_area='Ode-Remo',
            is_active=True
        )
        citizen_1.set_password('Citizen@Remo2026!')
        db.session.add(citizen_1)

        citizen_2 = User(
            full_name='Funke Ogundele',
            email='funke.ogundele@example.com',
            phone='08069876543',
            role='citizen',
            address='28 Oba Erinwole Road, Isara-Remo',
            community_area='Isara-Remo',
            is_active=True
        )
        citizen_2.set_password('Citizen@Remo2026!')
        db.session.add(citizen_2)

        citizen_3 = User(
            full_name='Tobiloba Alabi',
            email='tobi.alabi@example.com',
            phone='08024567890',
            role='citizen',
            address='5 Station Road, Ipara-Remo',
            community_area='Ipara-Remo',
            is_active=True
        )
        citizen_3.set_password('Citizen@Remo2026!')
        db.session.add(citizen_3)

        db.session.commit()

        print("Seeding Configurable Government Services...")
        services_data = [
            {
                'name': 'Certificate of Local Government Origin',
                'code': 'RMN-SRV-ORIGIN',
                'category': 'Certificates',
                'department_id': dept_objects['ADMIN'].id,
                'short_description': 'Official attestation confirming indigeneship of Remo North Local Government.',
                'full_description': 'This certificate is issued to bonafide indigenes of Remo North LGA for academic admissions, federal employment, military/paramilitary recruitment, and official identification purposes.',
                'eligibility': 'Must be an indigene of one of the towns in Remo North (Isara, Ode, Ipara, Akaka, Ilara, Orile-Oko) or child of indigenous parents.',
                'requirements_json': json.dumps([
                    'Letter of recommendation from family head or Ward Traditional Ruler',
                    'Passport photograph with white background',
                    'Valid National Identification Number (NIN)',
                    'Birth Certificate or Age Declaration'
                ]),
                'required_documents_json': json.dumps([
                    'Proof of Identity (NIN Slip / Voter Card)',
                    'Passport Photograph',
                    'Letter from Ward Councillor or Community Baale'
                ]),
                'processing_steps_json': json.dumps([
                    'Submit Application Online',
                    'Lineage & Community Ward Verification',
                    'Administrative Review',
                    'Chairman / Secretary Approval',
                    'Digital Certificate Issuance'
                ]),
                'fee_naira': 2500.0,
                'expected_days': 2,
                'icon_name': 'FileCheck'
            },
            {
                'name': 'Business Premises Registration & Trade Permit',
                'code': 'RMN-SRV-BIZREG',
                'category': 'Business & Trade',
                'department_id': dept_objects['FINANCE'].id,
                'short_description': 'Mandatory local government registration and operating permit for commercial enterprises.',
                'full_description': 'Grants statutory operating permission to shops, enterprises, artisan workshops, warehouses, and factories located within Remo North Local Government Area.',
                'eligibility': 'Any individual or corporate body conducting commercial, retail, or industrial activities in Remo North.',
                'requirements_json': json.dumps([
                    'CAC Business Name or Incorporation Certificate',
                    'Physical address of business with landmark',
                    'Nature of trade / business category',
                    'Contact details of business owner or representative'
                ]),
                'required_documents_json': json.dumps([
                    'CAC Certificate / Registration Document',
                    'Utility Bill or Tenancy Agreement',
                    'Owner Identification'
                ]),
                'processing_steps_json': json.dumps([
                    'Application Submission',
                    'Premises Categorization',
                    'Physical Site Verification',
                    'Fee Assessment & Approval',
                    'Permit Certificate Release'
                ]),
                'fee_naira': 5000.0,
                'expected_days': 3,
                'icon_name': 'Building2'
            },
            {
                'name': 'Community Development Association (CDA) Registration',
                'code': 'RMN-SRV-CDA',
                'category': 'Community & Social',
                'department_id': dept_objects['COMMUNITY'].id,
                'short_description': 'Official recognition and gazetting of neighborhood Community Development Associations.',
                'full_description': 'Enables resident associations, landlord associations, and community development groups to gain official council accreditation, participate in government grants, and access security collaboration.',
                'eligibility': 'Residential estates, quarters, or communities within Remo North with organized executive committees.',
                'requirements_json': json.dumps([
                    'Minutes of CDA inaugural meeting',
                    'List of elected executive officers and contact details',
                    'Constitution / Bye-laws of the association',
                    'Defined geographic boundary of the CDA'
                ]),
                'required_documents_json': json.dumps([
                    'CDA Constitution',
                    'Executive Officers Roster',
                    'Endorsement by Area Baale / Community Leader'
                ]),
                'processing_steps_json': json.dumps([
                    'Online Submission',
                    'Departmental Review',
                    'Community Officer Site Inspection',
                    'Secretariat Approval',
                    'Issuance of Certificate of Registration'
                ]),
                'fee_naira': 7500.0,
                'expected_days': 5,
                'icon_name': 'Users'
            },
            {
                'name': 'Environmental Sanitation & Health Inspection Permit',
                'code': 'RMN-SRV-ENV',
                'category': 'Environment & Sanitation',
                'department_id': dept_objects['HEALTH'].id,
                'short_description': 'Public health compliance certification for eateries, hotels, bakeries, and food handlers.',
                'full_description': 'Statutory certification ensuring commercial facilities and food establishments adhere to public health standards, waste disposal regulations, and environmental hygiene.',
                'eligibility': 'Food vendors, restaurants, event centres, schools, abattoirs, and hotels operating in Remo North.',
                'requirements_json': json.dumps([
                    'Evidence of proper refuse disposal agreement',
                    'Medical fitness certificates for food handling personnel',
                    'Adequate sanitary facilities inspection report'
                ]),
                'required_documents_json': json.dumps([
                    'Sanitary Inspection Form',
                    'Staff Medical Clearance Slips'
                ]),
                'processing_steps_json': json.dumps([
                    'Form Submission',
                    'Environmental Officer Inspection Visit',
                    'Sanitary Compliance Audit',
                    'Health Officer Sign-off',
                    'Issuance of Sanitation Certificate'
                ]),
                'fee_naira': 4000.0,
                'expected_days': 4,
                'icon_name': 'ShieldCheck'
            },
            {
                'name': 'Road Cut & Infrastructure Right-of-Way Permit',
                'code': 'RMN-SRV-RDCUT',
                'category': 'Infrastructure & Works',
                'department_id': dept_objects['WORKS'].id,
                'short_description': 'Permission to excavate or trench across municipal roads for water, pipe, or utility laying.',
                'full_description': 'Ensures municipal road infrastructure is protected and reinstated to high civil engineering standards following utility installations or water connections.',
                'eligibility': 'Contractors, utility companies, or property owners requiring excavation on council-maintained roads.',
                'requirements_json': json.dumps([
                    'Engineering sketch or plan of proposed excavation',
                    'Reinstatement commitment bond / guarantee',
                    'Traffic management plan during works'
                ]),
                'required_documents_json': json.dumps([
                    'Site Layout Drawing',
                    'Letter of Request with Dimension Details'
                ]),
                'processing_steps_json': json.dumps([
                    'Application Submission',
                    'Works Engineer Site Assessment',
                    'Reinstatement Assessment Fee',
                    'Permit Approval & Work Monitoring',
                    'Completion Inspection'
                ]),
                'fee_naira': 12000.0,
                'expected_days': 3,
                'icon_name': 'Wrench'
            },
            {
                'name': 'Public Event, Open Space & Hall Rental Permit',
                'code': 'RMN-SRV-EVENT',
                'category': 'Community & Social',
                'department_id': dept_objects['ADMIN'].id,
                'short_description': 'Permit for hosting social gatherings, crusades, rallies, or booking council halls.',
                'full_description': 'Permits usage of council multi-purpose halls or designates open council grounds for weddings, civic receptions, and community ceremonies.',
                'eligibility': 'Citizens, organizations, and event planners hosting events within Remo North LGA.',
                'requirements_json': json.dumps([
                    'Event date, time, and expected attendees',
                    'Sound permit request if public address system is used',
                    'Waste management and clean-up undertaking'
                ]),
                'required_documents_json': json.dumps([
                    'Applicant ID',
                    'Event Program / Schedule'
                ]),
                'processing_steps_json': json.dumps([
                    'Booking Request Submission',
                    'Date Availability Verification',
                    'Security & Sanitation Review',
                    'Approval & Slip Release'
                ]),
                'fee_naira': 15000.0,
                'expected_days': 2,
                'icon_name': 'Calendar'
            },
            {
                'name': 'Birth / Age Declaration Attestation Slip',
                'code': 'RMN-SRV-BIRTH',
                'category': 'Certificates',
                'department_id': dept_objects['ADMIN'].id,
                'short_description': 'Official local government attestation of birth or statutory age declaration.',
                'full_description': 'Provides local council attestation validating birth records or court statutory declarations for civil service, passport applications, and institutional use.',
                'eligibility': 'Any citizen born within Remo North Local Government Area or their parent/guardian.',
                'requirements_json': json.dumps([
                    'High Court Statutory Declaration of Age / Sworn Affidavit',
                    'Hospital Birth Certificate or Baptismal Record if available',
                    'Parent or Guardian details'
                ]),
                'required_documents_json': json.dumps([
                    'Sworn Court Affidavit',
                    'Passport Photograph'
                ]),
                'processing_steps_json': json.dumps([
                    'Submission',
                    'Registry Verification',
                    'Registry Officer Approval',
                    'Attestation Slip Release'
                ]),
                'fee_naira': 2000.0,
                'expected_days': 1,
                'icon_name': 'Baby'
            }
        ]

        service_objects = {}
        for s in services_data:
            srv = Service(**s)
            db.session.add(srv)
            service_objects[s['code']] = srv
        db.session.commit()

        print("Seeding Sample Applications with Full Status Lifecycles...")
        # App 1: Approved Origin Certificate
        app1 = Application(
            reference_number='RMN-2026-00125',
            citizen_id=citizen_1.id,
            service_id=service_objects['RMN-SRV-ORIGIN'].id,
            department_id=dept_objects['ADMIN'].id,
            assigned_staff_id=staff_admin.id,
            applicant_name='Adekunle Bello',
            applicant_phone='08051234567',
            applicant_email='ade.bello@example.com',
            applicant_address='14 Palace Way, Ode-Remo',
            community_area='Ode-Remo',
            form_data_json=json.dumps({
                'father_name': 'Chief Samuel Bello',
                'mother_name': 'Mrs. Abigail Bello',
                'village_compound': 'Ogunbona Compound, Ode-Remo',
                'ward': 'Ode Ward 1',
                'purpose': 'Federal Civil Service Commission recruitment'
            }),
            status='Approved',
            current_step_index=3,
            priority='Normal',
            staff_notes='All documents authenticated. Family lineage confirmed with Ward Councillor.',
            certificate_code='CERT-RMN-884219',
            created_at=datetime.utcnow() - timedelta(days=6)
        )
        db.session.add(app1)
        db.session.flush()

        doc1 = ApplicationDocument(
            application_id=app1.id,
            document_name='National_ID_Slip.pdf',
            file_url='/static/uploads/sample_nin_slip.pdf',
            file_type='pdf'
        )
        db.session.add(doc1)

        h1 = ApplicationStatusHistory(
            application_id=app1.id,
            status='Submitted',
            notes='Application submitted online by applicant.',
            changed_by_user_id=citizen_1.id,
            created_at=datetime.utcnow() - timedelta(days=6)
        )
        h2 = ApplicationStatusHistory(
            application_id=app1.id,
            status='Under Review',
            notes='Documents forwarded to Registry Division for indigeneship validation.',
            changed_by_user_id=staff_admin.id,
            created_at=datetime.utcnow() - timedelta(days=4)
        )
        h3 = ApplicationStatusHistory(
            application_id=app1.id,
            status='Approved',
            notes='Approved by Secretary to the Local Government. Digital certificate issued.',
            changed_by_user_id=staff_admin.id,
            created_at=datetime.utcnow() - timedelta(days=1)
        )
        db.session.add_all([h1, h2, h3])

        # App 2: Processing Business Registration
        app2 = Application(
            reference_number='RMN-2026-00126',
            citizen_id=citizen_2.id,
            service_id=service_objects['RMN-SRV-BIZREG'].id,
            department_id=dept_objects['FINANCE'].id,
            assigned_staff_id=admin_user.id,
            applicant_name='Funke Ogundele',
            applicant_phone='08069876543',
            applicant_email='funke.ogundele@example.com',
            applicant_address='28 Oba Erinwole Road, Isara-Remo',
            community_area='Isara-Remo',
            form_data_json=json.dumps({
                'business_name': 'Remo Heritage Agro-Processing Ltd',
                'business_category': 'Agricultural Produce & Milling',
                'business_address': 'Plot 4, Industrial Layout, Isara-Remo',
                'cac_number': 'RC-1849204',
                'employees_count': '12'
            }),
            status='Processing',
            current_step_index=2,
            priority='High',
            staff_notes='Physical site inspection scheduled for tomorrow morning.',
            created_at=datetime.utcnow() - timedelta(days=3)
        )
        db.session.add(app2)
        db.session.flush()

        app2_h1 = ApplicationStatusHistory(
            application_id=app2.id,
            status='Submitted',
            notes='Application submitted with CAC certification.',
            changed_by_user_id=citizen_2.id,
            created_at=datetime.utcnow() - timedelta(days=3)
        )
        app2_h2 = ApplicationStatusHistory(
            application_id=app2.id,
            status='Processing',
            notes='Revenue officer assigned. Site visit pending.',
            changed_by_user_id=admin_user.id,
            created_at=datetime.utcnow() - timedelta(days=1)
        )
        db.session.add_all([app2_h1, app2_h2])

        # App 3: CDA Registration Under Review
        app3 = Application(
            reference_number='RMN-2026-00127',
            citizen_id=citizen_3.id,
            service_id=service_objects['RMN-SRV-CDA'].id,
            department_id=dept_objects['COMMUNITY'].id,
            assigned_staff_id=staff_admin.id,
            applicant_name='Tobiloba Alabi',
            applicant_phone='08024567890',
            applicant_email='tobi.alabi@example.com',
            applicant_address='5 Station Road, Ipara-Remo',
            community_area='Ipara-Remo',
            form_data_json=json.dumps({
                'cda_name': 'Ipara Central Unity CDA',
                'president_name': 'Chief Kolawole Shonubi',
                'secretary_name': 'Tobiloba Alabi',
                'coverage_area': 'Station Road and environs up to Toll Gate',
                'bank_name': 'Wema Bank, Isara'
            }),
            status='Under Review',
            current_step_index=1,
            priority='Normal',
            staff_notes='Reviewing executive officers bio-data.',
            created_at=datetime.utcnow() - timedelta(days=2)
        )
        db.session.add(app3)

        # App 4: Road Cut Completed
        app4 = Application(
            reference_number='RMN-2026-00129',
            citizen_id=citizen_1.id,
            service_id=service_objects['RMN-SRV-RDCUT'].id,
            department_id=dept_objects['WORKS'].id,
            assigned_staff_id=staff_works.id,
            applicant_name='Adekunle Bello',
            applicant_phone='08051234567',
            applicant_email='ade.bello@example.com',
            applicant_address='14 Palace Way, Ode-Remo',
            community_area='Ode-Remo',
            form_data_json=json.dumps({
                'work_type': 'Ogun State Water Corporation domestic water pipe connection',
                'street_location': 'Palace Way opposite Central Mosque',
                'trench_length_meters': '4.5',
                'reinstatement_type': 'Asphalt resurfacing'
            }),
            status='Completed',
            current_step_index=4,
            priority='Normal',
            staff_notes='Reinstatement certified by Civil Engineer. Road restored to standard.',
            certificate_code='CERT-RMN-771920',
            created_at=datetime.utcnow() - timedelta(days=12)
        )
        db.session.add(app4)
        db.session.commit()

        print("Seeding Community Reports with Coordinates in Remo North...")
        # Coordinates in Remo North Local Government: Isara (7.00, 3.68), Ode (6.98, 3.71), Ipara (6.95, 3.66), Akaka (7.03, 3.73)
        reports_data = [
            {
                'reference_code': 'RMN-REP-00101',
                'citizen_id': citizen_2.id,
                'title': 'Deep Pothole Cluster near Isara High School Junction',
                'category': 'Roads & Transport',
                'description': 'Heavy erosions have created deep potholes obstructing vehicular passage along the major Isara High School access road. Commercial buses and tricycles regularly suffer axle damage.',
                'location_name': 'Isara High School Junction, Palace Road',
                'community_area': 'Isara-Remo',
                'latitude': 7.0042,
                'longitude': 3.6815,
                'status': 'In Progress',
                'assigned_department_id': dept_objects['WORKS'].id,
                'assigned_staff_id': staff_works.id,
                'reporter_name': 'Funke Ogundele',
                'reporter_phone': '08069876543'
            },
            {
                'reference_code': 'RMN-REP-00102',
                'citizen_id': citizen_1.id,
                'title': 'Blocked Drainage Causing Flood on Ode-Remo Market Road',
                'category': 'Drainage & Flood',
                'description': 'The concrete drainage canal running beside the Ode central food market is heavily silted with debris and plastic waste. Recent rains overflowed directly into market stalls.',
                'location_name': 'Opposite Ode Central Market, Main Road',
                'community_area': 'Ode-Remo',
                'latitude': 6.9854,
                'longitude': 3.7108,
                'status': 'Assigned',
                'assigned_department_id': dept_objects['WORKS'].id,
                'assigned_staff_id': staff_works.id,
                'reporter_name': 'Adekunle Bello',
                'reporter_phone': '08051234567'
            },
            {
                'reference_code': 'RMN-REP-00103',
                'citizen_id': citizen_3.id,
                'title': 'Malfunctioning Solar Streetlights along Ipara Express Way',
                'category': 'Street Lighting',
                'description': 'Four consecutive solar street light poles are completely dead at night, creating an unlit corridor that poses safety concerns for pedestrians and commuters.',
                'location_name': 'Old Toll Gate Corridor, Ipara-Remo',
                'community_area': 'Ipara-Remo',
                'latitude': 6.9542,
                'longitude': 3.6631,
                'status': 'Submitted',
                'assigned_department_id': dept_objects['WORKS'].id,
                'reporter_name': 'Tobiloba Alabi',
                'reporter_phone': '08024567890'
            },
            {
                'reference_code': 'RMN-REP-00104',
                'citizen_id': None,
                'title': 'Illegal Refuse Dump near Akaka Town Hall',
                'category': 'Waste & Sanitation',
                'description': 'Unregulated dumping of household refuse has piled up beside the community field in Akaka, attracting rodents and generating strong odors.',
                'location_name': 'Community Playground, Akaka-Remo',
                'community_area': 'Akaka-Remo',
                'latitude': 7.0351,
                'longitude': 3.7324,
                'status': 'Resolved',
                'assigned_department_id': dept_objects['HEALTH'].id,
                'assigned_staff_id': staff_health.id,
                'reporter_name': 'Akaka Youth Vanguard',
                'reporter_phone': '08039988776',
                'resolution_notes': 'Environmental Sanitation taskforce evacuated the refuse heap using council tippers and erected warning notice boards against illegal dumping.'
            },
            {
                'reference_code': 'RMN-REP-00105',
                'citizen_id': citizen_2.id,
                'title': 'Damaged Borehole Tap Head at Ilara Public Water Point',
                'category': 'Water Supply',
                'description': 'The community solar motorized borehole in Ilara has two broken brass tap heads leading to continuous clean water spillage.',
                'location_name': 'Ilara Community Square',
                'community_area': 'Ilara-Remo',
                'latitude': 7.0145,
                'longitude': 3.6932,
                'status': 'Under Review',
                'assigned_department_id': dept_objects['WORKS'].id,
                'reporter_name': 'Funke Ogundele',
                'reporter_phone': '08069876543'
            }
        ]

        for rep_data in reports_data:
            rep = CommunityReport(**rep_data)
            db.session.add(rep)
            db.session.flush()

            rep_up = CommunityReportUpdate(
                report_id=rep.id,
                status=rep.status,
                comment=f"Report logged with status '{rep.status}'.",
                updated_by_user_id=staff_works.id if rep.assigned_staff_id else None
            )
            db.session.add(rep_up)

        print("Seeding Citizen Complaints...")
        comp1 = Complaint(
            reference_code='RMN-CMP-00041',
            citizen_id=citizen_2.id,
            subject='Delay in Revenue Receipt Issuance for Trade Assessment',
            category='Service Delay',
            description='I paid the assessment fee at the revenue desk four days ago but have not yet received the official printed Treasury receipt for my business record.',
            related_application_ref='RMN-2026-00126',
            status='In Progress',
            assigned_department_id=dept_objects['FINANCE'].id,
            assigned_staff_id=admin_user.id,
            resolution_notes='Revenue desk verified the bank teller; official e-receipt has been processed and is ready for collection.'
        )
        db.session.add(comp1)
        db.session.flush()

        comp_up = ComplaintUpdate(
            complaint_id=comp1.id,
            status='In Progress',
            comment='Complaint acknowledged. Reconciling payment records with treasury desk.',
            updated_by_user_id=admin_user.id
        )
        db.session.add(comp_up)

        print("Seeding Official Council Announcements...")
        announcements_data = [
            {
                'title': 'Remo North Free Maternal & Child Immunization Exercise',
                'category': 'Health & Safety',
                'content': 'The Primary Health Care Department of Remo North Local Government announces a comprehensive 5-day immunization campaign across all 10 wards. Mothers and caregivers are encouraged to bring children aged 0-5 years for routine vaccination against polio, measles, and yellow fever at nearest primary health centres in Isara, Ode, Ipara, and Akaka.',
                'target_audience': 'All Citizens & Parents',
                'is_pinned': True,
                'is_published': True,
                'author_id': admin_user.id,
                'publish_date': datetime.utcnow() - timedelta(days=2),
                'expiry_date': datetime.utcnow() + timedelta(days=20)
            },
            {
                'title': '2026 Business Premises Harmonization & Assessment Notice',
                'category': 'Tax & Revenue',
                'content': 'All commercial operators, shop owners, petrol stations, and private institutions in Remo North LGA are informed that the statutory 2026 Business Premises inspection and renewal exercise has commenced. Payments should only be made through verified council digital channels or authorized bank branches.',
                'target_audience': 'Business Owners & Traders',
                'is_pinned': True,
                'is_published': True,
                'author_id': admin_user.id,
                'publish_date': datetime.utcnow() - timedelta(days=5),
                'expiry_date': datetime.utcnow() + timedelta(days=45)
            },
            {
                'title': 'Notice of Monthly State Environmental Sanitation Day',
                'category': 'Public Notice',
                'content': 'Citizens are reminded that the mandatory monthly environmental sanitation exercise takes place this Saturday between 7:00 AM and 10:00 AM. Vehicular and human movement will be restricted during this period. Please clear gutters and weed immediate surroundings.',
                'target_audience': 'All Citizens',
                'is_pinned': False,
                'is_published': True,
                'author_id': staff_admin.id,
                'publish_date': datetime.utcnow() - timedelta(days=1),
                'expiry_date': datetime.utcnow() + timedelta(days=7)
            },
            {
                'title': 'Youth ICT & Agricultural Empowerment Program Registration',
                'category': 'Community Development',
                'content': 'Remo North Local Government Council in partnership with Gateway Youth Development Initiative is calling for applications from youths aged 18-35 for free training in digital technologies, web development, modern poultry, and greenhouse vegetable farming. Apply through the e-government portal.',
                'target_audience': 'Youth & Students',
                'is_pinned': False,
                'is_published': True,
                'author_id': admin_user.id,
                'publish_date': datetime.utcnow() - timedelta(days=3),
                'expiry_date': datetime.utcnow() + timedelta(days=30)
            }
        ]

        for ann in announcements_data:
            a_obj = Announcement(**ann)
            db.session.add(a_obj)

        print("Seeding Initial Notifications...")
        notifs = [
            Notification(
                user_id=citizen_1.id,
                title='Application Approved: RMN-2026-00125',
                message='Your application for Certificate of Local Government Origin has been approved! Your Certificate Code is CERT-RMN-884219.',
                notification_type='application',
                related_entity_type='application',
                related_entity_id=app1.id,
                is_read=False
            ),
            Notification(
                user_id=citizen_2.id,
                title='Application Status Update: RMN-2026-00126',
                message='Your application for Business Premises Registration is currently Processing. An officer has been assigned.',
                notification_type='application',
                related_entity_type='application',
                related_entity_id=app2.id,
                is_read=True
            ),
            Notification(
                user_id=citizen_2.id,
                title='Community Report Status: RMN-REP-00101',
                message="Your road pothole report at Isara High School Junction has been updated to 'In Progress'.",
                notification_type='report',
                related_entity_type='report',
                related_entity_id=1,
                is_read=False
            ),
            Notification(
                user_id=staff_works.id,
                title='New Community Report Assigned',
                message='A new report (Blocked drainage on Ode-Remo Market Road) has been assigned to Works and Infrastructure.',
                notification_type='report',
                related_entity_type='report',
                related_entity_id=2,
                is_read=False
            )
        ]
        db.session.add_all(notifs)

        print("Seeding Default Website Branding & Landing Page Settings...")
        council_setting = Setting(
            site_name='Remo North Local Government',
            site_short_name='REMO NORTH',
            logo_url=None,
            hero_badge='Official E-Government Portal',
            hero_title='Empowering Remo North Through Modern Digital Governance',
            hero_subtitle='Access municipal services, submit statutory applications, report local infrastructure problems, and track approvals seamlessly from anywhere.',
            hero_cta_primary='Explore All Services',
            hero_cta_secondary='Report Community Issue',
            announcement_banner='Official Portal of Remo North Local Government, Ogun State • Secretariat: Isara-Remo',
            secretariat_address='Local Government Secretariat Complex, Palace Way, Isara-Remo',
            emergency_helpline='0800-REMO-HELP',
            main_phone='+234 (0) 803 111 2233',
            official_email='info@remonorth.og.gov.ng',
            state_name='Ogun State, Nigeria',
            about_summary='Remo North Local Government Area is an administrative hub in Ogun State with council headquarters situated in Isara-Remo. It encompasses 10 electoral wards across historic towns including Isara, Ode, Ipara, Akaka, Ilara, and Orile-Oko.'
        )
        db.session.add(council_setting)

        db.session.commit()
        print("\n==================================================================")
        print("DATABASE SUCCESSFULLY SEEDED WITH REALISTIC REMO NORTH DATA!")
        print("==================================================================")
        print("Demo Accounts Available for Evaluation:")
        print("1. Administrator:")
        print("   Email:    admin@remonorth.og.gov.ng")
        print("   Password: Admin@Remo2026!")
        print("2. Government Staff (Works Department):")
        print("   Email:    works.staff@remonorth.og.gov.ng")
        print("   Password: Staff@Remo2026!")
        print("3. Government Staff (Health Department):")
        print("   Email:    health.staff@remonorth.og.gov.ng")
        print("   Password: Staff@Remo2026!")
        print("4. Citizen (Adekunle Bello):")
        print("   Email:    ade.bello@example.com")
        print("   Password: Citizen@Remo2026!")
        print("==================================================================")

if __name__ == '__main__':
    seed_database()
