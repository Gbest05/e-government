import React, { useState, useEffect } from 'react';
import { applicationsService } from '../../services/api';
import { 
  FileText, 
  Search, 
  Clock, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Download, 
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  UserCheck 
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import TimelineTracker from '../../components/common/TimelineTracker';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';

const StaffApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Selected application for review
  const [selectedApp, setSelectedApp] = useState(null);

  // Status update state
  const [newStatus, setNewStatus] = useState('');
  const [officerNotes, setOfficerNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState(null);

  const statuses = ['All', 'Submitted', 'Under Review', 'Processing', 'Approved', 'Rejected', 'Completed'];

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, currentPage]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        per_page: 15,
        status: statusFilter,
        search: searchTerm
      };
      const res = await applicationsService.getApplications(params);
      setApplications(res.data.applications || []);
      setTotalPages(res.data.total_pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchApplications();
  };

  const openReviewModal = (app) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setOfficerNotes(app.staff_notes || '');
    setRejectionReason(app.rejection_reason || '');
    setStatusError(null);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    setStatusError(null);
    setUpdatingStatus(true);

    try {
      const payload = {
        status: newStatus,
        notes: officerNotes,
        rejection_reason: newStatus === 'Rejected' ? rejectionReason : ''
      };
      const res = await applicationsService.updateStatus(selectedApp.id, payload);
      // Update locally
      setSelectedApp(res.data.application);
      setApplications(applications.map(a => a.id === selectedApp.id ? res.data.application : a));
      alert(`Application updated to '${newStatus}' successfully.`);
    } catch (err) {
      setStatusError(err.response?.data?.error || 'Failed to update application status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-civic-700 tracking-wider uppercase">Staff Workbench</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
          Application Management & Review
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Inspect citizen documents, record review findings, advance processing stages, and issue certificates.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reference number, applicant name, phone..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-civic-600"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-civic-800 text-white font-semibold text-xs rounded-xl hover:bg-civic-900"
          >
            Filter
          </button>
        </form>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-slate-100 pt-2.5 scrollbar-none">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-civic-800 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table / Cards */}
      {loading ? (
        <LoadingSpinner message="Loading application queue..." />
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications found"
          description="There are currently no applications matching your search or status filter."
        />
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-civic-50 text-civic-800 border border-civic-200">
                    {app.reference_number}
                  </span>
                  <span className="text-xs font-bold text-slate-800">{app.applicant_name}</span>
                  <span className="text-[11px] text-slate-400">({app.community_area})</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {app.service_name}
                </h3>

                <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                  <span>Phone: {app.applicant_phone}</span>
                  <span>&bull;</span>
                  <span>Submitted: {new Date(app.created_at).toLocaleDateString()}</span>
                  <span>&bull;</span>
                  <span>Priority: <strong className={app.priority === 'High' ? 'text-rose-600' : 'text-slate-700'}>{app.priority}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <StatusBadge status={app.status} size="sm" />
                <button
                  type="button"
                  onClick={() => openReviewModal(app)}
                  className="px-4 py-2 text-xs font-bold text-white bg-civic-800 hover:bg-civic-900 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Review & Decide</span>
                </button>
              </div>
            </div>
          ))}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Staff Review Modal */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title={`Review Application: ${selectedApp?.reference_number}`}
        maxWidth="max-w-3xl"
      >
        {selectedApp && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-civic-800">{selectedApp.reference_number}</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedApp.service_name}</h3>
                <p className="text-xs text-slate-500">Applicant: <strong>{selectedApp.applicant_name}</strong> &bull; {selectedApp.community_area}</p>
              </div>
              <StatusBadge status={selectedApp.status} size="md" />
            </div>

            {/* Stepper Timeline */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Processing Lifecycle
              </h4>
              <TimelineTracker
                currentStatus={selectedApp.status}
                currentIndex={selectedApp.current_step_index}
                customSteps={selectedApp.processing_steps}
                history={selectedApp.status_history}
              />
            </div>

            {/* Applicant Submitted Data */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Applicant Information & Form Data
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] block">Full Name</span>
                  <span className="font-semibold text-slate-800">{selectedApp.applicant_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Phone Number</span>
                  <span className="font-semibold text-slate-800">{selectedApp.applicant_phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Email</span>
                  <span className="font-semibold text-slate-800">{selectedApp.applicant_email}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Residential Address</span>
                  <span className="font-semibold text-slate-800">{selectedApp.applicant_address}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Ward / Community</span>
                  <span className="font-semibold text-slate-800">{selectedApp.community_area}</span>
                </div>
                {selectedApp.form_data && Object.entries(selectedApp.form_data).map(([k, v]) => {
                  if (!v) return null;
                  return (
                    <div key={k}>
                      <span className="text-slate-400 text-[10px] block capitalize">{k.replace('_', ' ')}</span>
                      <span className="font-semibold text-slate-800">{String(v)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Attached Documents */}
            {selectedApp.documents && selectedApp.documents.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Submitted Evidence Documents ({selectedApp.documents.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedApp.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-civic-800 font-semibold"
                    >
                      <span className="truncate">{doc.document_name}</span>
                      <Download className="w-4 h-4 text-slate-400 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Staff Status Action Form */}
            <form onSubmit={handleUpdateStatus} className="pt-4 border-t border-slate-200 space-y-4 bg-slate-50/50 p-4 rounded-2xl border">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-civic-700" />
                <span>Update Application Status & Officer Notes</span>
              </h4>

              {statusError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                  {statusError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Next Status *</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-civic-600 text-slate-800 font-semibold"
                  >
                    <option value="Submitted">Submitted (Initial)</option>
                    <option value="Under Review">Under Review (Document Check)</option>
                    <option value="Processing">Processing (Field Verification)</option>
                    <option value="Approved">Approved (Issue Certificate)</option>
                    <option value="Rejected">Rejected (Declined)</option>
                    <option value="Completed">Completed (Finalized)</option>
                  </select>
                </div>

                {newStatus === 'Rejected' && (
                  <div>
                    <label className="block text-xs font-bold text-rose-700 mb-1">Reason for Rejection *</label>
                    <input
                      type="text"
                      required
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="e.g. Incomplete indigeneship lineage documentation"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-rose-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Notes / Instructions to Applicant (Visible to citizen & recorded in history)
                </label>
                <textarea
                  rows={3}
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  placeholder="e.g. Lineage authenticated by Ward Councillor. Certificate code generated."
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-civic-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  disabled={updatingStatus}
                  className="px-6 py-2.5 bg-civic-800 hover:bg-civic-900 text-white font-bold text-xs rounded-xl transition-all shadow disabled:opacity-50"
                >
                  {updatingStatus ? 'Updating Status...' : 'Save & Notify Citizen'}
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StaffApplicationsPage;
