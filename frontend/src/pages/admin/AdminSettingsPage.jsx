import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { settingsService, uploadFile, getFileUrl } from '../../services/api';
import { 
  Landmark, 
  Save, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  Loader2 
} from 'lucide-react';

const AdminSettingsPage = () => {
  const { settings, updateSettings } = useSettings();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    site_name: '',
    site_short_name: '',
    logo_url: '',
    hero_badge: '',
    hero_title: '',
    hero_subtitle: '',
    hero_cta_primary: '',
    hero_cta_secondary: '',
    announcement_banner: '',
    secretariat_address: '',
    emergency_helpline: '',
    main_phone: '',
    official_email: '',
    state_name: '',
    about_summary: ''
  });

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (settings) {
      setFormData({
        site_name: settings.site_name || '',
        site_short_name: settings.site_short_name || '',
        logo_url: settings.logo_url || '',
        hero_badge: settings.hero_badge || '',
        hero_title: settings.hero_title || '',
        hero_subtitle: settings.hero_subtitle || '',
        hero_cta_primary: settings.hero_cta_primary || '',
        hero_cta_secondary: settings.hero_cta_secondary || '',
        announcement_banner: settings.announcement_banner || '',
        secretariat_address: settings.secretariat_address || '',
        emergency_helpline: settings.emergency_helpline || '',
        main_phone: settings.main_phone || '',
        official_email: settings.official_email || '',
        state_name: settings.state_name || '',
        about_summary: settings.about_summary || ''
      });
    }
  }, [settings]);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, SVG, WEBP).');
      return;
    }

    setUploadingLogo(true);
    setErrorMsg(null);
    try {
      const uploaded = await uploadFile(file, 'branding');
      if (uploaded?.url) {
        setFormData((prev) => ({ ...prev, logo_url: uploaded.url }));
        setSuccessMsg('Logo uploaded! Click "Save Configuration" below to apply.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to upload logo image.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, logo_url: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await settingsService.updateSettings(formData);
      if (res.data?.settings) {
        updateSettings(res.data.settings);
        setSuccessMsg('Website branding, logo, and landing page content updated successfully!');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to update settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-bold text-civic-700 tracking-wider uppercase">Executive Portal Customization</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
          Website Branding & Landing Page Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Customize the council name, logo, landing page headlines, announcement banner, and contact information in real-time.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold rounded-2xl flex items-center gap-2.5 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold rounded-2xl flex items-center gap-2.5 shadow-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Live Preview Card */}
      <div className="bg-gradient-to-br from-civic-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-civic-700/50 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>Real-time Landing Page Hero Preview</span>
          </span>
          <span className="text-[11px] text-slate-400 bg-white/10 px-2.5 py-0.5 rounded-full">
            Live Preview
          </span>
        </div>

        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-civic-800/80 border border-civic-600/50 text-[11px] text-amber-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{formData.hero_badge || 'Official E-Government Portal'}</span>
          </div>

          <div className="flex items-center gap-3">
            {formData.logo_url ? (
              <img
                src={getFileUrl(formData.logo_url)}
                alt="Logo Preview"
                className="w-12 h-12 rounded-xl object-contain bg-white p-1 shadow"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-civic-700 flex items-center justify-center text-amber-300 shadow">
                <Landmark className="w-7 h-7" />
              </div>
            )}
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                {formData.hero_title || 'Empowering Remo North Through Modern Digital Governance'}
              </h2>
              <p className="text-xs text-emerald-300 font-semibold">
                {formData.site_name || 'Remo North Local Government'} &bull; {formData.state_name || 'Ogun State, Nigeria'}
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">
            {formData.hero_subtitle || 'Access municipal services, submit statutory applications, report local infrastructure problems, and track approvals seamlessly from anywhere.'}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <span className="px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow">
              {formData.hero_cta_primary || 'Explore All Services'}
            </span>
            <span className="px-4 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white font-medium text-xs">
              {formData.hero_cta_secondary || 'Report Community Issue'}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Logo & Website Identity */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-civic-700" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Website Logo & Brand Identity
            </h2>
          </div>

          {/* Logo Upload Box */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Official Council Logo
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-inner shrink-0">
                {formData.logo_url ? (
                  <img
                    src={getFileUrl(formData.logo_url)}
                    alt="Council Logo"
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="text-center p-2">
                    <Landmark className="w-8 h-8 text-slate-400 mx-auto" />
                    <span className="text-[9px] font-bold text-slate-400 block mt-0.5">Default Icon</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  className="hidden"
                />

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="px-4 py-2 bg-civic-800 hover:bg-civic-900 text-white font-bold text-xs rounded-xl transition-all shadow flex items-center gap-2 disabled:opacity-50"
                  >
                    {uploadingLogo ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>{formData.logo_url ? 'Change Logo' : 'Upload Council Logo'}</span>
                      </>
                    )}
                  </button>

                  {formData.logo_url && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Logo</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Recommended format: Transparent PNG, SVG, or high-res JPG (Max 5MB).
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Local Government Name
              </label>
              <input
                type="text"
                required
                value={formData.site_name}
                onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                placeholder="e.g. Remo North Local Government"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Short Name / Header Acronym
              </label>
              <input
                type="text"
                required
                value={formData.site_short_name}
                onChange={(e) => setFormData({ ...formData, site_short_name: e.target.value })}
                placeholder="e.g. REMO NORTH"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              State & Country
            </label>
            <input
              type="text"
              required
              value={formData.state_name}
              onChange={(e) => setFormData({ ...formData, state_name: e.target.value })}
              placeholder="e.g. Ogun State, Nigeria"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 2: Landing Page Headlines & Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-civic-700" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. Landing Page Copy & Hero Banners
            </h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Top Announcement Marquee Banner (Navbar Top)
            </label>
            <input
              type="text"
              value={formData.announcement_banner}
              onChange={(e) => setFormData({ ...formData, announcement_banner: e.target.value })}
              placeholder="e.g. Official Portal of Remo North Local Government, Ogun State"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hero Badge Tag
              </label>
              <input
                type="text"
                value={formData.hero_badge}
                onChange={(e) => setFormData({ ...formData, hero_badge: e.target.value })}
                placeholder="e.g. Official E-Government Portal"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hero Headline (Main Title)
              </label>
              <input
                type="text"
                required
                value={formData.hero_title}
                onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                placeholder="e.g. Empowering Remo North Through Modern Digital Governance"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Hero Subtitle Description
            </label>
            <textarea
              rows={3}
              value={formData.hero_subtitle}
              onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
              placeholder="Detailed introductory message for citizens on the landing page..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Primary Button Text (Hero CTA)
              </label>
              <input
                type="text"
                value={formData.hero_cta_primary}
                onChange={(e) => setFormData({ ...formData, hero_cta_primary: e.target.value })}
                placeholder="e.g. Explore All Services"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Secondary Button Text (Hero CTA)
              </label>
              <input
                type="text"
                value={formData.hero_cta_secondary}
                onChange={(e) => setFormData({ ...formData, hero_cta_secondary: e.target.value })}
                placeholder="e.g. Report Community Issue"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Council Overview / About Summary
            </label>
            <textarea
              rows={3}
              value={formData.about_summary}
              onChange={(e) => setFormData({ ...formData, about_summary: e.target.value })}
              placeholder="Brief summary of the local government and covered wards..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 3: Secretariat Address & Hotlines */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <Phone className="w-5 h-5 text-civic-700" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              3. Secretariat Location & Helplines
            </h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Council Secretariat Physical Address
            </label>
            <input
              type="text"
              value={formData.secretariat_address}
              onChange={(e) => setFormData({ ...formData, secretariat_address: e.target.value })}
              placeholder="e.g. Local Government Secretariat Complex, Palace Way, Isara-Remo"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Emergency Helpline
              </label>
              <input
                type="text"
                value={formData.emergency_helpline}
                onChange={(e) => setFormData({ ...formData, emergency_helpline: e.target.value })}
                placeholder="e.g. 0800-REMO-HELP"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Main Registry Phone
              </label>
              <input
                type="text"
                value={formData.main_phone}
                onChange={(e) => setFormData({ ...formData, main_phone: e.target.value })}
                placeholder="e.g. +234 (0) 803 111 2233"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Inquiries Email
              </label>
              <input
                type="email"
                value={formData.official_email}
                onChange={(e) => setFormData({ ...formData, official_email: e.target.value })}
                placeholder="e.g. info@remonorth.og.gov.ng"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-civic-800 hover:bg-civic-900 text-white font-bold text-sm rounded-xl transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Configuration</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
