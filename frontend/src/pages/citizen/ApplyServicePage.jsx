import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { servicesService, applicationsService, uploadFile } from '../../services/api';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Building2, 
  Clock, 
  ShieldCheck,
  Loader2 
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

const ApplyServicePage = () => {
  const [searchParams] = useSearchParams();
  const preselectedServiceId = searchParams.get('service_id');

  const { user } = useAuth();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(preselectedServiceId || '');
  const [selectedService, setSelectedService] = useState(null);
  const [loadingServices, setLoadingServices] = useState(true);

  // Form states
  const [formData, setFormData] = useState({
    applicant_name: user?.full_name || '',
    applicant_phone: user?.phone || '',
    applicant_email: user?.email || '',
    applicant_address: user?.address || '',
    community_area: user?.community_area || 'Isara-Remo',
    priority: 'Normal',
    // Dynamic fields
    purpose: '',
    father_name: '',
    mother_name: '',
    village_compound: '',
    nin_number: '',
    business_name: '',
    cac_number: '',
    cda_name: '',
    notes: ''
  });

  const [documents, setDocuments] = useState([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const communities = [
    'Isara-Remo',
    'Ode-Remo',
    'Ipara-Remo',
    'Akaka-Remo',
    'Ilara-Remo',
    'Orile-Oko'
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await servicesService.getServices({});
        setServices(res.data.services || []);
        if (preselectedServiceId) {
          const match = res.data.services.find(s => String(s.id) === String(preselectedServiceId));
          if (match) setSelectedService(match);
        } else if (res.data.services.length > 0) {
          setSelectedServiceId(res.data.services[0].id);
          setSelectedService(res.data.services[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, [preselectedServiceId]);

  const handleServiceChange = (e) => {
    const sId = e.target.value;
    setSelectedServiceId(sId);
    const match = services.find(s => String(s.id) === String(sId));
    setSelectedService(match || null);
  };

  const handleFileUpload = async (e, docName) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingDoc(true);
    try {
      const uploadRes = await uploadFile(file, 'applications');
      setDocuments((prev) => [
        ...prev.filter(d => d.name !== docName),
        { name: docName, url: uploadRes.url, file_type: uploadRes.file_type }
      ]);
    } catch (err) {
      alert('File upload failed. Please try again.');
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    const payload = {
      service_id: selectedServiceId,
      applicant_name: formData.applicant_name,
      applicant_phone: formData.applicant_phone,
      applicant_email: formData.applicant_email,
      applicant_address: formData.applicant_address,
      community_area: formData.community_area,
      priority: formData.priority,
      form_data: {
        purpose: formData.purpose,
        father_name: formData.father_name,
        mother_name: formData.mother_name,
        village_compound: formData.village_compound,
        nin_number: formData.nin_number,
        business_name: formData.business_name,
        cac_number: formData.cac_number,
        cda_name: formData.cda_name,
        additional_notes: formData.notes
      },
      documents: documents
    };

    try {
      const res = await applicationsService.submitApplication(payload);
      setSubmissionSuccess(res.data);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.error || 'Failed to submit application. Please verify all required fields.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingServices) return <LoadingSpinner message="Preparing application portal..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-civic-700 tracking-wider uppercase">Citizen Portal</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
          Submit Government Application
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Complete your online request to initiate official review by Remo North council officers.
        </p>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={!!submissionSuccess}
        onClose={() => {
          setSubmissionSuccess(null);
          navigate('/citizen/applications');
        }}
        title="Application Successfully Submitted!"
        maxWidth="max-w-md"
      >
        {submissionSuccess && (
          <div className="text-center space-y-4 py-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                {submissionSuccess.message}
              </h3>
              <p className="text-xs text-slate-500">
                Please save your unique reference code for official correspondence and tracking:
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Application Reference Code
              </span>
              <span className="text-xl font-mono font-black text-civic-800 tracking-wide block mt-0.5">
                {submissionSuccess.reference_number}
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              A notification has been sent to your account. Council officers will inspect your documents.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => navigate('/citizen/applications')}
                className="w-full py-2.5 bg-civic-800 text-white rounded-xl text-xs font-bold hover:bg-civic-900 transition-colors"
              >
                View in My Applications
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {/* 1. Service Selection */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-civic-700" />
            <span>1. Select Government Service</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Desired Service *
              </label>
              <select
                value={selectedServiceId}
                onChange={handleServiceChange}
                required
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 text-slate-800"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            {selectedService && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Department:</span>
                  <span className="font-bold text-slate-800">{selectedService.department_name}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Turnaround:</span>
                  <span className="font-bold text-slate-800">{selectedService.expected_days} Business Days</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Statutory Fee:</span>
                  <span className="font-bold text-emerald-700">
                    {selectedService.fee_naira > 0 ? `₦${selectedService.fee_naira.toLocaleString()}` : 'Free'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. Applicant Biodata */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-civic-700" />
            <span>2. Applicant Personal & Residential Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Applicant Full Name *</label>
              <input
                type="text"
                required
                value={formData.applicant_name}
                onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.applicant_phone}
                onChange={(e) => setFormData({ ...formData, applicant_phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formData.applicant_email}
                onChange={(e) => setFormData({ ...formData, applicant_email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Remo North Town / Community *</label>
              <select
                value={formData.community_area}
                onChange={(e) => setFormData({ ...formData, community_area: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 text-slate-800"
              >
                {communities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Residential Street Address *</label>
            <input
              type="text"
              required
              value={formData.applicant_address}
              onChange={(e) => setFormData({ ...formData, applicant_address: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
            />
          </div>
        </div>

        {/* 3. Dynamic Service-Specific Fields */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-civic-700" />
            <span>3. Service Specific Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Purpose of Application *</label>
              <input
                type="text"
                required
                placeholder="e.g. University Admission, Employment, Business Licensing"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">National Identity Number (NIN)</label>
              <input
                type="text"
                placeholder="11-digit NIN"
                value={formData.nin_number}
                onChange={(e) => setFormData({ ...formData, nin_number: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Conditional Origin Fields */}
          {selectedService?.category === 'Certificates' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Father's Name & Town</label>
                <input
                  type="text"
                  placeholder="e.g. Chief Samuel Bello, Ode-Remo"
                  value={formData.father_name}
                  onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mother's Maiden Name</label>
                <input
                  type="text"
                  placeholder="e.g. Abigail Osoba"
                  value={formData.mother_name}
                  onChange={(e) => setFormData({ ...formData, mother_name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ancestral Family Compound</label>
                <input
                  type="text"
                  placeholder="e.g. Ogunbona Compound"
                  value={formData.village_compound}
                  onChange={(e) => setFormData({ ...formData, village_compound: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          )}

          {/* Conditional Business Fields */}
          {selectedService?.category === 'Business & Trade' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Business Registered Name</label>
                <input
                  type="text"
                  placeholder="e.g. Remo Agribusiness Enterprise"
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">CAC Registration / RC Number</label>
                <input
                  type="text"
                  placeholder="e.g. BN-293849"
                  value={formData.cac_number}
                  onChange={(e) => setFormData({ ...formData, cac_number: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Additional Notes / Remarks</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional information to assist council review..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
        </div>

        {/* 4. Document Uploads */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Upload className="w-4 h-4 text-civic-700" />
            <span>4. Attach Supporting Documents</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {selectedService?.required_documents && selectedService.required_documents.length > 0 ? (
              selectedService.required_documents.map((docName, idx) => {
                const uploaded = documents.find(d => d.name === docName);
                return (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <span className="text-xs font-bold text-slate-800 block truncate">
                      {docName}
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <label className="cursor-pointer px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-100 text-slate-700 flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-slate-500" />
                        <span>{uploaded ? 'Replace' : 'Upload File'}</span>
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                          onChange={(e) => handleFileUpload(e, docName)}
                          className="hidden"
                        />
                      </label>
                      {uploaded ? (
                        <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Attached
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">PDF / Image</span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-500">
                No mandatory attachments for this service. You can submit directly.
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={submitting || uploadingDoc}
            className="px-8 py-3.5 bg-civic-800 hover:bg-civic-900 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting Application...</span>
              </>
            ) : (
              <>
                <span>Submit & Generate Reference</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplyServicePage;
