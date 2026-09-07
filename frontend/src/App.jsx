import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Common components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Sidebar from './components/common/Sidebar';
import DashboardHeader from './components/common/DashboardHeader';
import LoadingSpinner from './components/common/LoadingSpinner';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import ServicesPage from './pages/public/ServicesPage';
import ServiceDetailPage from './pages/public/ServiceDetailPage';
import PublicTrackingPage from './pages/public/PublicTrackingPage';
import ReportProblemPublicPage from './pages/public/ReportProblemPublicPage';
import AnnouncementsPage from './pages/public/AnnouncementsPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ApplyServicePage from './pages/citizen/ApplyServicePage';
import MyApplicationsPage from './pages/citizen/MyApplicationsPage';
import ReportProblemPage from './pages/citizen/ReportProblemPage';
import MyReportsPage from './pages/citizen/MyReportsPage';
import ComplaintsPage from './pages/citizen/ComplaintsPage';
import NotificationsPage from './pages/citizen/NotificationsPage';
import ProfilePage from './pages/citizen/ProfilePage';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffApplicationsPage from './pages/staff/StaffApplicationsPage';
import StaffReportsPage from './pages/staff/StaffReportsPage';
import StaffComplaintsPage from './pages/staff/StaffComplaintsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminStaffPage from './pages/admin/AdminStaffPage';
import AdminDepartmentsPage from './pages/admin/AdminDepartmentsPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';
import AdminApplicationsPage from './pages/admin/AdminApplicationsPage';
import AdminReportsMapPage from './pages/admin/AdminReportsMapPage';
import AdminAnnouncementsPage from './pages/admin/AdminAnnouncementsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

// Layout for Public Pages
const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Layout for Dashboard Portals (Citizen, Staff, Admin)
const DashboardLayout = ({ defaultTitle = 'Portal' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col lg:pl-72 min-w-0 transition-all">
        <DashboardHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title={defaultTitle}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Role-based route guard
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner message="Authenticating session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to permitted home
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'staff') return <Navigate to="/staff" replace />;
    return <Navigate to="/citizen" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <Routes>
      {/* 1. Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />
        <Route path="/track" element={<PublicTrackingPage />} />
        <Route path="/report" element={<ReportProblemPublicPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 2. Citizen Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['citizen', 'admin']} />}>
        <Route path="/citizen" element={<DashboardLayout defaultTitle="Citizen Portal" />}>
          <Route index element={<CitizenDashboard />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="apply" element={<ApplyServicePage />} />
          <Route path="applications" element={<MyApplicationsPage />} />
          <Route path="report" element={<ReportProblemPage />} />
          <Route path="reports" element={<MyReportsPage />} />
          <Route path="complaints" element={<ComplaintsPage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* 3. Staff Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['staff', 'admin']} />}>
        <Route path="/staff" element={<DashboardLayout defaultTitle="Staff Workbench" />}>
          <Route index element={<StaffDashboard />} />
          <Route path="applications" element={<StaffApplicationsPage />} />
          <Route path="reports" element={<StaffReportsPage />} />
          <Route path="complaints" element={<StaffComplaintsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
      </Route>

      {/* 4. Administrator Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<DashboardLayout defaultTitle="Council Administration" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="citizens" element={<AdminUsersPage />} />
          <Route path="staff" element={<AdminStaffPage />} />
          <Route path="departments" element={<AdminDepartmentsPage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="applications" element={<AdminApplicationsPage />} />
          <Route path="map" element={<AdminReportsMapPage />} />
          <Route path="complaints" element={<StaffComplaintsPage />} />
          <Route path="announcements" element={<AdminAnnouncementsPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
