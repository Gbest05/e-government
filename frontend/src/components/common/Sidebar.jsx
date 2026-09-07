import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getFileUrl } from '../../services/api';
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  MessageSquare,
  Bell,
  Megaphone,
  User,
  Settings,
  LogOut,
  Users,
  Building2,
  MapPin,
  BarChart3,
  CheckCircle2,
  FolderOpen,
  Home,
  X,
  Landmark
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  // Citizen Links
  const citizenNav = [
    { name: 'Dashboard Overview', path: '/citizen', icon: LayoutDashboard, end: true },
    { name: 'Apply for Services', path: '/citizen/services', icon: FolderOpen },
    { name: 'My Applications', path: '/citizen/applications', icon: FileText },
    { name: 'Report Community Issue', path: '/citizen/report', icon: AlertTriangle },
    { name: 'My Problem Reports', path: '/citizen/reports', icon: CheckCircle2 },
    { name: 'My Complaints', path: '/citizen/complaints', icon: MessageSquare },
    { name: 'Announcements', path: '/citizen/announcements', icon: Megaphone },
    { name: 'Notifications', path: '/citizen/notifications', icon: Bell },
    { name: 'My Profile & Settings', path: '/citizen/profile', icon: User },
  ];

  // Staff Links
  const staffNav = [
    { name: 'Staff Queue Overview', path: '/staff', icon: LayoutDashboard, end: true },
    { name: 'Application Reviews', path: '/staff/applications', icon: FileText },
    { name: 'Community Reports', path: '/staff/reports', icon: AlertTriangle },
    { name: 'Citizen Complaints', path: '/staff/complaints', icon: MessageSquare },
    { name: 'Staff Profile', path: '/staff/profile', icon: User },
  ];

  // Admin Links
  const adminNav = [
    { name: 'Executive Overview', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Citizens Directory', path: '/admin/citizens', icon: Users },
    { name: 'Staff Management', path: '/admin/staff', icon: User },
    { name: 'Council Departments', path: '/admin/departments', icon: Building2 },
    { name: 'Government Services', path: '/admin/services', icon: FolderOpen },
    { name: 'All Applications', path: '/admin/applications', icon: FileText },
    { name: 'Reports Map Dashboard', path: '/admin/map', icon: MapPin },
    { name: 'Complaints Oversight', path: '/admin/complaints', icon: MessageSquare },
    { name: 'Council Announcements', path: '/admin/announcements', icon: Megaphone },
    { name: 'Reports & Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  const currentNav = user.role === 'admin' ? adminNav : user.role === 'staff' ? staffNav : citizenNav;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Branding */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-civic-700 flex items-center justify-center text-white shadow">
              <Landmark className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-wide block">REMO NORTH LGA</span>
              <span className="text-[11px] font-medium text-civic-400 capitalize">
                {user.role} Portal
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="px-5 py-4 bg-slate-950/50 border-b border-slate-800/80 flex items-center gap-3">
          {user?.profile_image ? (
            <img
              src={getFileUrl(user.profile_image)}
              alt={user.full_name}
              className="w-10 h-10 rounded-full object-cover border border-civic-600 shadow shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-civic-800 text-white font-bold flex items-center justify-center text-sm border border-civic-600 shrink-0">
              {user.full_name?.charAt(0) || 'U'}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">{user.full_name}</p>
            <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-civic-900 text-civic-300 border border-civic-700">
              {user.role}
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-2">
            Main Navigation
          </div>
          {currentNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-civic-700 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-1">
          <NavLink
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Public Website</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
