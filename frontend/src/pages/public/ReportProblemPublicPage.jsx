import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { reportsService, uploadFile } from '../../services/api';
import LeafletMapPicker from '../../components/common/LeafletMapPicker';
import { 
  AlertTriangle, 
  MapPin, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert,
  Loader2
} from 'lucide-react';

const ReportProblemPublicPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Roads & Transport',
    description: '',
    location_name: '',
    community_area: 'Isara-Remo',
    latitude: 7.0012,
    longitude: 3.6821,
    image_url: '',
    reporter_name: '',
    reporter_phone: ''
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);
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
      const uploadRes = await uploadFile(file, 'community_reports');
      setFormData((prev) => ({ ...prev, image_url: uploadRes.url }));
    } catch (err) {
      console.error(err);
      alert('Failed to upload image. Please try another file.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      const res = await reportsService.submitReport(formData);
      setSubmittedResult(res.data);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.error || 'Something went wrong submitting your report. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Civic Problem Reporting</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Report a Community Problem
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Report broken infrastructure, flood blockages, waste issues, or dark streets across Remo North. Council taskforce teams review and dispatch field crews.
          </p>
        </div>

        {submittedResult ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">
                Community Report Submitted!
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you for being an active citizen. Your report has been logged and assigned to the relevant department for inspection.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 max-w-sm mx-auto border border-slate-200 space-y-1">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Your Report Reference Code
              </span>
              <span className="text-xl font-mono font-black text-civic-800">
                {submittedResult.reference_code}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setSubmittedResult(null);
                  setFormData({
                    title: '',
                    category: 'Roads & Transport',
                    description: '',
                    location_name: '',
                    community_area: 'Isara-Remo',
                    latitude: 7.0012,
                    longitude: 3.6821,
                    image_url: '',
                    reporter_name: '',
                    reporter_phone: ''
                  });
                }}
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-700"
              >
                Report Another Problem
              </button>
              <Link
                to="/services"
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold bg-civic-800 text-white rounded-xl hover:bg-civic-900 shadow"
              >
                Browse Services
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {/* Problem Details */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
                1. Problem Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Problem Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Deep pothole on Palace Road"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 text-slate-800"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the severity of the problem, its impact on road users or residents, and any safety hazards..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Location & Map Pin */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
                2. Location & Map Coordinate Pin
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Community / Town *
                  </label>
                  <select
                    value={formData.community_area}
                    onChange={(e) => setFormData({ ...formData, community_area: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 text-slate-800"
                  >
                    {communities.map((comm) => (
                      <option key={comm} value={comm}>{comm}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Street / Landmark Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location_name}
                    onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                    placeholder="e.g. Opposite Central Mosque, Palace Way"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Interactive OpenStreetMap */}
              <LeafletMapPicker
                latitude={formData.latitude}
                longitude={formData.longitude}
                onChange={(lat, lng) => setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }))}
                height="320px"
              />
            </div>

            {/* Photo & Reporter Info */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
                3. Photo Evidence & Optional Contact
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Attach Photo / Evidence (Optional)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer px-4 py-2.5 border border-slate-300 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-slate-500" />
                      <span>{uploadingImage ? 'Uploading...' : 'Choose Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    {formData.image_url && (
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Photo Attached
                      </span>
                    )}
                  </div>
                  {formData.image_url && (
                    <div className="mt-2 w-24 h-24 rounded-lg overflow-hidden border border-slate-200">
                      <img src={formData.image_url} alt="Uploaded evidence" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Name (Optional / Anonymous)
                    </label>
                    <input
                      type="text"
                      value={formData.reporter_name}
                      onChange={(e) => setFormData({ ...formData, reporter_name: e.target.value })}
                      placeholder="Leave blank to report anonymously"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number (Optional for SMS updates)
                    </label>
                    <input
                      type="tel"
                      value={formData.reporter_phone}
                      onChange={(e) => setFormData({ ...formData, reporter_phone: e.target.value })}
                      placeholder="e.g. 08031234567"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={submitting || uploadingImage}
                className="w-full sm:w-auto px-8 py-3.5 bg-civic-800 hover:bg-civic-900 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Report...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Community Report</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportProblemPublicPage;
