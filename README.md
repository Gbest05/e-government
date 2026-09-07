# Remo North Local Government E-Government Management System
### Case Study: Remo North LGA, Ogun State, Nigeria (Secretariat: Isara-Remo)

[![Python 3.12](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Flask 3.0](https://img.shields.io/badge/Flask-3.0-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Render Deployable](https://img.shields.io/badge/Deployment-Render_Ready-46E3B7?logo=render&logoColor=white)](https://render.com/)

---

## 1. Executive Summary & Problem Statement

**Remo North Local Government Area (LGA)** is one of the pivotal administrative hubs in Ogun State, Nigeria, comprising historic communities such as **Isara-Remo** (Council Headquarters), **Ode-Remo**, **Ipara**, **Akaka**, **Ilara**, and **Orile-Oko**, organized into **10 Electoral Wards**.

Historically, civic operations across the LGA relied heavily on in-person visits, manual physical forms, paper-based document verification, and fragmented paper registries. This traditional workflow introduced significant friction:
- **Citizens** experienced prolonged turnaround times, high transportation overhead to the Isara Secretariat, and lack of transparency regarding the status of their statutory certificates and permits.
- **Municipal Departments** (Works & Housing, Primary Health, Community Development, Agriculture, Administration, and Finance) operated in silos with paper files prone to misplacement, duplicate entries, and delayed approvals.
- **Public Infrastructure Issues** (potholes along Sagamu-Benin expressway corridors, blocked drainage in market squares, fallen electric poles, damaged boreholes) suffered from delayed reporting and lack of spatial coordination.

### The Solution: Remo North E-Government Platform
This full-stack digital civic platform centralizes, automates, and democratizes access to municipal governance for over 100,000 residents, municipal staff, and council executives.

---

## 2. Key Capabilities & System Features

### 🏛️ Citizen Self-Service Portal
- **Digital Services Catalog**: Search, filter, and review fees, requirements, and turnaround times for certificates (Birth Attestation, Certificate of State of Origin, Trade Permits, Health Center Registration, Building Approvals, Burial Permits).
- **Dynamic Application Workflow**: Upload supporting documents, pay or record statutory fees, and receive a cryptographically unique reference code (e.g. `RMN-2026-A1B2C`).
- **Interactive Lifecycle Tracking**: 5-step visual milestone tracker (`SUBMITTED` &rarr; `UNDER_REVIEW` &rarr; `VERIFIED` &rarr; `APPROVED` &rarr; `COMPLETED`) with immutable timestamped action audit logs.
- **Digital Certificate & Clearance Slips**: Real-time verifiable digital certificate view with QR/verification stamp code for approved applications.
- **Geospatial Community Problem Reporting**: Report potholes, drainage blocks, water outages, health hazards, and illegal dumps with OpenStreetMap pin selection (preset to Remo North towns), photo evidence upload, and resolution progress monitoring.
- **Citizen Grievance Redressal (Complaints)**: Lodge private complaints against municipal service delivery and receive official redress notes.
- **In-App Notification Center**: Instant bell alerts for status changes, verification requests, and council advisories.

### 👷 Staff Workbench & Departmental Queues
- **Department-Filtered Processing**: Automatic assignment of incoming cases to responsible council departments (e.g., Health Center Registration &rarr; Primary Health Care; Building Approvals & Pothole Reports &rarr; Works & Housing).
- **Document Verification Station**: View and verify uploaded applicant credentials, supporting affidavits, and national identity documents.
- **Status Advancement & Audit Trail**: Advance status with review notes, schedule inspections, request additional documents, or issue digital approvals.
- **Field Crew Triage & Resolution**: Dispatch repair teams to community report coordinates, update resolution status (`INVESTIGATING` &rarr; `RESOLVED`), and log public action summaries.
- **Complaint Mediation**: Investigate citizen grievances and reply with official resolution memos.

### 👑 Council Executive Administration
- **Executive KPI Dashboard**: Live tracking of total revenue generated, volume of applications processed, community issues resolved, citizen satisfaction rates, and average turnaround time.
- **Geospatial Infrastructure Map**: Full-screen interactive OpenStreetMap displaying all community reports across the 10 wards of Remo North, color-coded by category (Infrastructure, Health, Sanitation, Environment, Public Safety).
- **Dynamic Service Catalogue Manager**: Create, modify, enable, or disable municipal services, fee schedules, and required document checklists without touching code.
- **Departmental Governance**: Manage council departments, assign heads of department, and monitor departmental performance metrics.
- **Staff Provisioning & RBAC**: Provision staff accounts, assign specific departments, and enforce least-privilege role-based access control.
- **Citizen Directory**: Search and audit registered citizens, view submission histories, and manage account statuses.
- **Official Council Announcements**: Draft, target (All Citizens, Wards, Staff), and publish council bulletins with priority pinning.
- **Turnaround & Departmental Analytics**: Visual bar and pie charts detailing departmental load, application outcomes, and monthly report distribution.

---

## 3. Technology Architecture

```
                               ┌────────────────────────────────────────┐
                               │       React 18 + Vite Frontend         │
                               │   (Tailwind CSS, Lucide, Leaflet OS)   │
                               └──────────────────┬─────────────────────┘
                                                  │
                                                  │ REST APIs (JWT Auth / JSON)
                                                  ▼
                               ┌────────────────────────────────────────┐
                               │           Flask 3.0 REST API           │
                               │   (Blueprints, PyJWT, Flask-Bcrypt)    │
                               └──────┬──────────────────────┬──────────┘
                                      │                      │
                   ┌──────────────────▼──────┐        ┌──────▼──────────────────┐
                   │  SQLAlchemy ORM Layer   │        │     Upload Service      │
                   │  (SQLite / PostgreSQL)  │        │ (Cloudinary + Local Dir)│
                   └─────────────────────────┘        └─────────────────────────┘
```

| Layer | Technology | Key Libraries & Purpose |
|---|---|---|
| **Frontend** | React 18 (Vite) | `react-router-dom` v6, `lucide-react`, `tailwindcss`, `axios`, `leaflet`, `react-leaflet` |
| **Backend** | Python 3.12 (Flask 3.0) | `Flask-SQLAlchemy`, `Flask-Bcrypt`, `PyJWT`, `Flask-Cors`, `python-dotenv`, `gunicorn` |
| **Database** | SQLite / PostgreSQL | Relational schema with foreign keys, indexes, and full migration readiness |
| **File Storage**| Dual-mode Storage | Cloudinary API integration with automatic zero-configuration local fallback |
| **Deployment**| Render Blueprint | `render.yaml` zero-config deployment specification for Web API + Static SPA |

---

## 4. Pre-Configured Evaluation Accounts

The database comes pre-seeded with realistic Remo North data, applications, geocoded reports, and four distinct user roles. On the login screen (`/login`), a **1-Click Demo Account Switcher** allows instant credential autofill for immediate evaluation:

| Role | Email Address | Password | Department / Scope |
|---|---|---|---|
| **Administrator** | `admin@remonorth.og.gov.ng` | `Admin@Remo2026!` | Council-Wide Governance & Oversight |
| **Staff (Works)** | `works.staff@remonorth.og.gov.ng` | `Staff@Remo2026!` | Works, Housing & Transport Department |
| **Staff (Health)** | `health.staff@remonorth.og.gov.ng` | `Staff@Remo2026!` | Primary Health Care & Environment |
| **Citizen** | `ade.bello@example.com` | `Citizen@Remo2026!` | Isara Ward 1 Resident (Registered Citizen) |

*You may also click **"Register as a New Citizen"** on the registration page to test fresh citizen onboarding.*

---

## 5. Local Development & Setup Guide

### Prerequisites
- **Python 3.10+** (Python 3.12 recommended)
- **Node.js 18+** & **npm**

### Step 1: Clone Repository & Workspace Layout
```bash
cd c:\Users\DELL\Desktop\GBEST\typescript\e-govern
```

### Step 2: Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# Windows (cmd):
.venv\Scripts\activate.bat
# macOS / Linux:
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Seed the database with Remo North wards, departments, services, and demo records
python seed.py

# Start the Flask API server (runs on http://127.0.0.1:5000)
python app.py
```

### Step 3: Frontend Setup
Open a second terminal window:
```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite development server (runs on http://localhost:5173 with proxy to Flask)
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 6. API Route Blueprint Documentation

The backend organizes all functionality into modular Flask Blueprints under `/api`:

| Blueprint | Route Prefix | Key Endpoints | Description |
|---|---|---|---|
| **Auth** | `/api/auth` | `POST /register`, `POST /login`, `GET /me`, `PUT /profile`, `PUT /change-password` | JWT token issuing, profile updates, role verification |
| **Services** | `/api/services` | `GET /`, `GET /<id>`, `POST /`, `PUT /<id>`, `DELETE /<id>` | Public service directory & admin CRUD |
| **Applications** | `/api/applications` | `GET /`, `POST /`, `GET /<id>`, `GET /track/<ref>`, `PUT /<id>/status` | Multi-step filing, public code tracking, status updates |
| **Reports** | `/api/reports` | `GET /`, `POST /`, `GET /<id>`, `PUT /<id>/status` | Geospatial issue logging with Leaflet coordinates & status triage |
| **Complaints** | `/api/complaints` | `GET /`, `POST /`, `GET /<id>`, `PUT /<id>/resolve` | Grievance lodging, tracking, and council resolution notes |
| **Announcements**| `/api/announcements` | `GET /`, `POST /`, `PUT /<id>`, `DELETE /<id>` | Council bulletins, ward alerts, priority pinning |
| **Departments** | `/api/departments` | `GET /`, `POST /`, `PUT /<id>`, `DELETE /<id>` | Council department directory & governance |
| **Notifications**| `/api/notifications`| `GET /`, `PUT /<id>/read`, `PUT /read-all` | User in-app notification inbox |
| **Admin** | `/api/admin` | `GET /stats`, `GET /analytics`, `GET /users`, `POST /users/staff` | Executive metrics, charts data, staff provisioning |
| **Staff** | `/api/staff` | `GET /stats`, `GET /queue` | Department-filtered case count and queue |
| **Uploads** | `/api/uploads` | `POST /`, `POST /multiple` | Cloudinary / local disk multipart file uploads |

---

## 7. Production Deployment (Render)

This repository includes a production-ready **Render Blueprint** (`render.yaml`).

### Deployment Steps:
1. Push your repository to **GitHub** or **GitLab**.
2. Log in to your [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** &rarr; **Blueprint**.
4. Connect this repository. Render will automatically detect `render.yaml` and configure:
   - **`remo-north-egovern-api`**: Python Web Service running Gunicorn (`gunicorn app:app`) with auto-generated JWT and Flask secrets.
   - **`remo-north-egovern-client`**: React Static Site with automatic SPA redirect rules (`/*` &rarr; `/index.html`) and connection to the backend API service.
5. Click **Apply**. Render builds and deploys both services automatically.

### Production Environment Variables Reference:
- `SECRET_KEY`: Cryptographically random secret string.
- `JWT_SECRET_KEY`: Secret string for signing JSON Web Tokens.
- `DATABASE_URL`: (Optional) PostgreSQL connection URI (e.g. `postgresql://...`). If left unset, uses persistent local SQLite.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: (Optional) Cloudinary credentials for cloud-hosted images and documents.
- `VITE_API_URL`: Fully qualified URL of the deployed Flask API (for the frontend static site).

---

## 8. Remo North LGA Context & Geographic Coverage

- **State**: Ogun State, Nigeria
- **Headquarters**: Isara-Remo Secretariat
- **Electoral Wards (10 Wards)**:
  1. Isara Ward I
  2. Isara Ward II
  3. Isara Ward III
  4. Ode Ward I
  5. Ode Ward II
  6. Ipara Ward
  7. Akaka Ward
  8. Ilara / Alafia Ward
  9. Orile-Oko Ward
  10. Okesopin / Area Ward
- **Coordinates**: Central Isara (`7.0012° N, 3.6821° E`), Ode-Remo (`6.9745° N, 3.6934° E`), Ipara (`6.9421° N, 3.6712° E`), Akaka (`7.0341° N, 3.7123° E`).

---

## 9. License & Statutory Notice

Developed for **Remo North Local Government Council, Ogun State, Nigeria**.
All statutory emblems, local ordinances, service fees, and administrative procedures reflect the official guidelines of Ogun State Local Government Administration.
