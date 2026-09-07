import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Landmark, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Sparkles, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const user = await login(emailOrPhone, password);
      // Redirect according to user role
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'staff') {
        navigate('/staff');
      } else {
        navigate('/citizen');
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.error || 'Invalid credentials. Please verify your email/phone and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Demo 1-click accounts
  const demoAccounts = [
    {
      roleName: 'Council Administrator',
      email: 'admin@remonorth.og.gov.ng',
      pass: 'Admin@Remo2026!',
      badge: 'Full Council Oversight & Config',
      color: 'border-purple-200 bg-purple-50/50 hover:bg-purple-100/50 text-purple-900'
    },
    {
      roleName: 'Works Staff Officer',
      email: 'works.staff@remonorth.og.gov.ng',
      pass: 'Staff@Remo2026!',
      badge: 'Applications & Infrastructure Reviews',
      color: 'border-amber-200 bg-amber-50/50 hover:bg-amber-100/50 text-amber-900'
    },
    {
      roleName: 'Health & Environment Staff',
      email: 'health.staff@remonorth.og.gov.ng',
      pass: 'Staff@Remo2026!',
      badge: 'Sanitation & Permits Review',
      color: 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/50 text-emerald-900'
    },
    {
      roleName: 'Citizen (Adekunle Bello)',
      email: 'ade.bello@example.com',
      pass: 'Citizen@Remo2026!',
      badge: 'Origin Cert, Track & Reports',
      color: 'border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 text-blue-900'
    },
  ];

  const handleQuickLogin = async (acc) => {
    setEmailOrPhone(acc.email);
    setPassword(acc.pass);
    setErrorMessage(null);
    setLoading(true);

    try {
      const user = await login(acc.email, acc.pass);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'staff') navigate('/staff');
      else navigate('/citizen');
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="w-12 h-12 rounded-2xl bg-civic-800 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
            <Landmark className="w-7 h-7 text-amber-300" />
          </div>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Sign In to Your Account
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
          Remo North Local Government E-Government Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-xl border border-slate-200 space-y-6">
          {/* Quick Demo Selector */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>1-Click Test Account Switcher</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                Evaluation Mode
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.roleName}
                  type="button"
                  onClick={() => handleQuickLogin(acc)}
                  disabled={loading}
                  className={`p-2.5 rounded-xl border text-left transition-all ${acc.color} flex flex-col justify-between`}
                >
                  <div className="font-bold text-xs">{acc.roleName}</div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">{acc.badge}</div>
                </button>
              ))}
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address or Phone Number
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="e.g. ade.bello@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <span className="text-[11px] text-civic-700 hover:text-civic-900 cursor-pointer font-semibold">
                  Forgot Password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-civic-800 hover:bg-civic-900 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-civic-800 hover:text-civic-900">
              Register Citizen Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
