import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Landmark, ShieldCheck, ChevronRight, User, LogOut, FileText, AlertTriangle } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Track Request', path: '/track' },
    { name: 'Report a Problem', path: '/report' },
    { name: 'Announcements', path: '/announcements' },
    { name: 'About Council', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'staff') return '/staff';
    return '/citizen';
  };

  return (
    <nav className="bg-white/95 backdrop-blur border-b border-slate-200 sticky top-0 z-50 transition-all">
      {/* Civic top badge bar */}
      <div className="bg-civic-900 text-slate-100 text-xs py-1 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Official Portal of Remo North Local Government, Ogun State</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-300">
            <span>Council Secretariat, Isara-Remo</span>
            <span>Emergency: 0800-REMO-HELP</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-civic-800 to-civic-600 flex items-center justify-center text-white shadow-md shadow-civic-900/10 group-hover:scale-105 transition-transform">
              <Landmark className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-slate-900 leading-tight tracking-tight flex items-center gap-1.5">
                <span>REMO NORTH</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-civic-100 text-civic-800 font-semibold border border-civic-200">
                  L.G.A
                </span>
              </div>
              <div className="text-xs font-medium text-slate-500">
                E-Government Management System
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-civic-50 text-civic-800 font-semibold'
                      : 'text-slate-600 hover:text-civic-800 hover:bg-slate-100/70'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-civic-800 text-white text-sm font-semibold hover:bg-civic-900 shadow-sm transition-all"
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard ({user.role})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-civic-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-civic-800 hover:bg-civic-900 rounded-lg shadow-sm transition-all"
                >
                  Register Citizen
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 lg:hidden">
            {isAuthenticated && (
              <Link
                to={getDashboardPath()}
                className="px-2.5 py-1.5 rounded-lg bg-civic-100 text-civic-800 text-xs font-semibold"
              >
                Dashboard
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle navigation"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100 hover:text-civic-800"
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-civic-800 text-white rounded-lg font-semibold text-sm"
                >
                  <User className="w-4 h-4" />
                  <span>Go to {user.role.toUpperCase()} Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 text-center text-rose-600 font-semibold text-sm hover:bg-rose-50 rounded-lg"
                >
                  Log Out ({user.full_name})
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 text-center border border-slate-300 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 text-center bg-civic-800 text-white font-semibold text-sm rounded-lg hover:bg-civic-900 shadow"
                >
                  Register as Citizen
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
