import React, { useState, useEffect } from 'react';
import { applicationsService, departmentsService } from '../../services/api';
import { FileText, Search, Building2, Download, Eye, Clock, CheckCircle2 } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import TimelineTracker from '../../components/common/TimelineTracker';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';

const AdminApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedApp, setSelectedApp] = useState(null);

  const statuses = ['All', 'Submitted', 'Under Review', 'Processing', 'Approved', 'Rejected', 'Completed'];

  useEffect(() => {
    departmentsService.getDepartments({}).then(res => setDepartments(res.data.departments || []));
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, deptFilter, currentPage]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        per_page: 15,
        status: statusFilter,
        department_id: deptFilter !== 'All' ? deptFilter : undefined,
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
      <div>
        <span className="text-xs font-bold text-civic-700 tracking-wider uppercase">Audit & Governance</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
          Council-Wide Applications Audit
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Executive audit of all citizen applications submitted across all departments and local wards.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reference, citizen name, phone number..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-civic-600"
            />
          </div>
          <select
            value={deptFilter}
            onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
          >
            <option value="All">All Departments</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
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
              onClick={() => { setStatusFilter(st); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st ? 'bg-civic-800 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Auditing applications database..." />
      ) : applications.length === 0 ? (
        <EmptyState title="No applications match criteria" description="Change status or department filters to view records." />
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
                  <span className="text-xs font-bold text-slate-900">{app.applicant_name}</span>
                  <span className="text-[11px] text-slate-400">({app.community_area})</span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 truncate">{app.service_name}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                  <span>Dept: <strong>{app.department_name}</strong></span>
                  <span>&bull;</span>
                  <span>Assigned Officer: {app.assigned_staff_name || 'Unassigned'}</span>
                  <span>&bull;</span>
                  <span>Submitted: {new Date(app.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <StatusBadge status={app.status} size="sm" />
                <button
                  type="button"
                  onClick={() => setSelectedApp(app)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Audit Record</span>
                </button>
              </div>
            </div>
          ))}

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      {/* Audit Detail Modal */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title={`Audit: ${selectedApp?.reference_number}`}
        maxWidth="max-w-2xl"
      >
        {selectedApp && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-civic-800">{selectedApp.reference_number}</span>
                <h3 className="text-base font-bold text-slate-900">{selectedApp.service_name}</h3>
                <p className="text-xs text-slate-500">Applicant: {selectedApp.applicant_name} ({selectedApp.applicant_phone})</p>
              </div>
              <StatusBadge status={selectedApp.status} size="sm" />
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Status Timeline</h4>
              <TimelineTracker
                currentStatus={selectedApp.status}
                currentIndex={selectedApp.current_step_index}
                customSteps={selectedApp.processing_steps}
                history={selectedApp.status_history}
              />
            </div>

            {selectedApp.certificate_code && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                <span className="text-emerald-700 block text-[10px] font-bold uppercase">Issued Certificate Number</span>
                <strong className="font-mono text-emerald-900 text-sm">{selectedApp.certificate_code}</strong>
              </div>
            )}

            {selectedApp.staff_notes && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Officer Internal Notes</span>
                <p className="text-slate-700 mt-0.5">{selectedApp.staff_notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminApplicationsPage;
