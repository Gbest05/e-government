import React, { useState } from 'react';
import { Landmark, Save, ShieldCheck, Database, Server, CheckCircle2 } from 'lucide-react';

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState({
    council_name: 'Remo North Local Government',
    state: 'Ogun State, Nigeria',
    secretariat_address: 'Local Government Secretariat Complex, Palace Way, Isara-Remo',
    emergency_helpline: '0800-REMO-HELP',
    main_phone: '+234 (0) 803 111 2233',
    official_email: 'info@remonorth.og.gov.ng',
    system_version: '1.0.0-PROD',
    database_driver: 'SQLite 3 (Relational with Foreign Keys / PostgreSQL-Ready)'
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-bold text-civic-700 tracking-wider uppercase">System Administration</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
          Council System Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Configure platform parameters, local council institutional metadata, and emergency hotlines.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        {saved && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Council institutional settings updated successfully.</span>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-civic-700" />
            <span>1. Institutional Identity</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Local Government Title</label>
              <input
                type="text"
                value={settings.council_name}
                onChange={(e) => setSettings({ ...settings, council_name: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">State / Country</label>
              <input
                type="text"
                value={settings.state}
                onChange={(e) => setSettings({ ...settings, state: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Council Secretariat Address</label>
            <input
              type="text"
              value={settings.secretariat_address}
              onChange={(e) => setSettings({ ...settings, secretariat_address: e.target.value })}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-civic-700" />
            <span>2. Communications & Emergency Helplines</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Toll-Free</label>
              <input
                type="text"
                value={settings.emergency_helpline}
                onChange={(e) => setSettings({ ...settings, emergency_helpline: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Main Secretariat Phone</label>
              <input
                type="text"
                value={settings.main_phone}
                onChange={(e) => setSettings({ ...settings, main_phone: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Registry Email</label>
              <input
                type="email"
                value={settings.official_email}
                onChange={(e) => setSettings({ ...settings, official_email: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <Database className="w-4 h-4 text-civic-700" />
            <span>3. Technical & Deployment Parameters</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Database Architecture</span>
              <strong className="text-slate-800">{settings.database_driver}</strong>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Portal Engine Version</span>
              <strong className="text-slate-800 font-mono">{settings.system_version}</strong>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-civic-800 hover:bg-civic-900 text-white font-bold text-xs rounded-xl transition-all shadow flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
