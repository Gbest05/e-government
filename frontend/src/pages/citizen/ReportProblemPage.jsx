import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { reportsService, uploadFile } from '../../services/api';
import LeafletMapPicker from '../../components/common/LeafletMapPicker';
import { AlertTriangle, MapPin, Upload, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

const ReportProblemPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    category: 'Roads & Transport',
    description: '',
    location_name: '',
    community_area: user?.community_area || 'Isara-Remo',
    latitude: 7.0012,
    longitude: 3.6821,
    image_url: '',
    reporter_name: user?.full_name || '',
    reporter_phone: user?.phone || ''
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const categories = [
    'Roads & Transport',
    'Waste & Sanitation',
    'Street Lighting',
    'Drainage & Flood',
    'Water Supply',
    'Public Facilities',
    'Other'
  ];

  const communities = [
    'Isara-Remo',
    'Ode-Remo',
    'Ipara-Remo',
    'Akaka-Remo',
    'Ilara-Remo',
    'Orile-Oko'
  ];

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await uploadFile(file, 'community_reports');
      setForm((prev) => ({ ...prev, image_url: res.url }));
    } catch (err) {
      alert('Photo upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      await reportsService.submitReport(form);
      navigate('/citizen/reports');
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Failed to submit problem report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-bold text-amber-700 tracking-wider uppercase">Citizen Problem Reporting</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
          Report a Community Problem
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Help council public works and environmental health teams inspect and repair local issues.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Problem Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Blocked culvert causing flood"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 text-slate-800"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Detailed Description *</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the problem, approximate duration, hazard severity, and impact..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Community / Area *</label>
              <select
                value={form.community_area}
                onChange={(e) => setForm({ ...form, community_area: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 text-slate-800"
              >
                {communities.map((comm) => (
                  <option key={comm} value={comm}>{comm}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Location / Landmark *</label>
              <input
                type="text"
                required
                value={form.location_name}
                onChange={(e) => setForm({ ...form, location_name: e.target.value })}
                placeholder="e.g. Near Ode Primary Health Centre"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Leaflet Map Pin */}
          <div className="pt-2">
            <LeafletMapPicker
              latitude={form.latitude}
              longitude={form.longitude}
              onChange={(lat, lng) => setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }))}
              height="300px"
            />
          </div>

          {/* Photo attachment */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <label className="cursor-pointer px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-2">
                <Upload className="w-4 h-4 text-slate-500" />
                <span>{uploadingImage ? 'Uploading...' : 'Attach Problem Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {form.image_url && (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Photo Attached
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="px-8 py-3 bg-civic-800 hover:bg-civic-900 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Problem Report</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReportProblemPage;
