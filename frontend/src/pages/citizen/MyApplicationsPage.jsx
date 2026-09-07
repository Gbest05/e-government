import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationsService } from '../../services/api';
import { 
  FileText, 
  Search, 
  Clock, 
  Building2, 
  ArrowRight, 
  Eye, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  Plus
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import TimelineTracker from '../../components/common/TimelineTracker';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedApp, setSelectedApp] = useState(null);

  const statuses = ['All', 'Submitted', 'Under Review', 'Processing', 'Approved', 'Rejected', 'Completed'];

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, currentPage]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        per_page: 10,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-civic-700 tracking-wider uppercase">Citizen Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            My Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            View, track, and download official local government certificates and permits.
          </p>
        </div>

        <Link
          to="/citizen/apply"
          className="px-4 py-2.5 bg-civic-800 hover:bg-civic-900 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Application</span>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by reference number (e.g. RMN-2026-00125)..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-civic-600"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-civic-800 text-white font-semibold text-xs rounded-xl hover:bg-civic-900 transition-colors shrink-0"
          >
            Search
          </button>
        </form>

        {/* Status Pills */}
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

      {/* Applications List */}
      {loading ? (
        <LoadingSpinner message="Fetching your applications..." />
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications found"
          description="You don't have any applications under this status filter."
          action={
            <Link
              to="/citizen/apply"
              className="px-4 py-2 bg-civic-800 text-white rounded-lg text-xs font-semibold"
            >
              Apply Now
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-civic-50 text-civic-800 border border-civic-200">
                    {app.reference_number}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Submitted: {new Date(app.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug truncate">
                  {app.service_name}
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{app.department_name}</span>
                  </span>
                  <span>&bull;</span>
                  <span>Fee: {app.fee_naira > 0 ? `₦${app.fee_naira.toLocaleString()}` : 'Free'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <StatusBadge status={app.status} size="sm" />
                <button
                  type="button"
                  onClick={() => setSelectedApp(app)}
                  className="px-3.5 py-2 text-xs font-bold text-civic-800 bg-civic-50 hover:bg-civic-800 hover:text-white rounded-xl transition-all flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
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

      {/* Details & Slip Modal */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title={`Application: ${selectedApp?.reference_number}`}
        maxWidth="max-w-3xl"
      >
        {selectedApp && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-civic-800 block">
                  {selectedApp.reference_number}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedApp.service_name}
                </h3>
                <p className="text-xs text-slate-400">{selectedApp.department_name}</p>
              </div>
              <div>
                <StatusBadge status={selectedApp.status} size="md" />
              </div>
            </div>

            {/* Stepper Timeline */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Processing Timeline
              </h4>
              <TimelineTracker
                currentStatus={selectedApp.status}
                currentIndex={selectedApp.current_step_index}
                customSteps={selectedApp.processing_steps}
                history={selectedApp.status_history}
              />
            </div>

            {/* Digital Certificate / Slip Card if Approved */}
            {selectedApp.certificate_code && (
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 text-emerald-950 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-emerald-700" />
                    <span className="font-bold text-xs uppercase tracking-wider text-emerald-800">
                      Official Council Attestation Certificate
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">
                    STATUS: VALID
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Beneficiary</span>
                    <strong className="text-slate-800">{selectedApp.applicant_name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Certificate Code</span>
                    <strong className="text-emerald-800 font-mono">{selectedApp.certificate_code}</strong>
                  </div>
                </div>
                <p className="text-[11px] text-emerald-700 border-t border-emerald-200 pt-2 italic">
                  This electronic slip serves as verified proof of issuance by Remo North Local Government, Ogun State.
                </p>
              </div>
            )}

            {/* Rejection / Staff notes */}
            {selectedApp.staff_notes && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block mb-1">Council Review Notes:</span>
                <p className="text-slate-600">{selectedApp.staff_notes}</p>
              </div>
            )}

            {/* Form submitted details */}
            <div className="border-t border-slate-100 pt-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Submitted Applicant Information
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl">
                <div>
                  <span className="text-slate-400 text-[10px] block">Applicant Name</span>
                  <span className="font-semibold text-slate-800">{selectedApp.applicant_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Phone Number</span>
                  <span className="font-semibold text-slate-800">{selectedApp.applicant_phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Community / Town</span>
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
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Attached Documents
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
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyApplicationsPage;
