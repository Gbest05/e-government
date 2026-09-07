import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { getFileUrl } from '../../services/api';
import { Landmark, Phone, Mail, MapPin, Shield, ExternalLink, Heart } from 'lucide-react';

const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Council Overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {settings?.logo_url ? (
                <img
                  src={getFileUrl(settings.logo_url)}
                  alt={settings?.site_name || 'Logo'}
                  className="w-10 h-10 rounded-xl object-contain bg-white p-1 shadow-lg"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-civic-700 flex items-center justify-center text-white shadow-lg">
                  <Landmark className="w-6 h-6 text-amber-300" />
                </div>
              )}
              <div>
                <span className="text-lg font-bold text-white tracking-wide uppercase">
                  {settings?.site_name || 'REMO NORTH LOCAL GOVERNMENT'}
                </span>
                <p className="text-xs text-civic-400 font-medium">
                  {settings?.state_name || 'Ogun State, Nigeria'} | E-Government Portal
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {settings?.about_summary || 'Empowering citizens across Isara-Remo, Ode-Remo, Ipara, Akaka, Ilara, and neighboring wards with seamless digital access to municipal services, transparent request tracking, and responsive community problem resolution.'}
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
                LGA Code: OG/RMN
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
                10 Electoral Wards
              </span>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Citizen Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services" className="hover:text-civic-400 transition-colors">Certificate of Origin</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-civic-400 transition-colors">Business Trade Permits</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-civic-400 transition-colors">CDA Accreditation</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-civic-400 transition-colors">Environmental Sanitation</Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-civic-400 transition-colors font-medium text-amber-300">Track Application</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Engagement */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Civic Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/report" className="hover:text-civic-400 transition-colors">Report Community Problem</Link>
              </li>
              <li>
                <Link to="/announcements" className="hover:text-civic-400 transition-colors">Council Announcements</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-civic-400 transition-colors">About Remo North LG</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-civic-400 transition-colors">Contact & Feedback</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-civic-400 transition-colors">Staff & Officer Portal</Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Council Secretariat Office */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Secretariat Address</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-civic-400 shrink-0 mt-0.5" />
                <span>{settings?.secretariat_address || 'Local Government Secretariat Complex, Palace Way, Isara-Remo, Ogun State'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-civic-400 shrink-0" />
                <span>{settings?.main_phone || '+234 (0) 803 111 2233'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-civic-400 shrink-0" />
                <span>{settings?.official_email || 'info@remonorth.og.gov.ng'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center md:text-left leading-relaxed">
            &copy; 2026 E-Government Management System. Case Study: Remo North Local Government, Ogun State, Nigeria.
          </p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-200 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-200 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-200 cursor-pointer">Accessibility</span>
            <span className="hover:text-slate-200 cursor-pointer">ND Project Implementation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
