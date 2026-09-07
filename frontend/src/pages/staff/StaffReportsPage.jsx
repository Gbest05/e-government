import React, { useState, useEffect } from 'react';
import { reportsService } from '../../services/api';
import { 
  AlertTriangle, 
  Search, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Building2,
  Filter,
  UserCheck 
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';

const StaffReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [communityFilter, setCommunityFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected report for update
  const [selectedReport, setSelectedReport] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [officerComment, setOfficerComment] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const categories = ['All', 'Roads & Transport', 'Waste & Sanitation', 'Street Lighting', 'Drainage & Flood', 'Water Supply', 'Public Facilities', 'Other'];
  const statuses = ['All', 'Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];
  const communities = ['All', 'Isara-Remo', 'Ode-Remo', 'Ipara-Remo', 'Akaka-Remo', 'Ilara-Remo', 'Orile-Oko'];

  useEffect(() => {
    fetchReports();
  }, [categoryFilter, statusFilter, communityFilter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = {
        category: categoryFilter,
        status: statusFilter,
        community_area: communityFilter,
        search: searchTerm
      };
      const res = await reportsService.getReports(params);
      setReports(res.data.reports || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReports();
  };

  const openUpdateModal = (report) => {
    setSelectedReport(report);
    setNewStatus(report.status);
    setOfficerComment('');
    setResolutionNotes(report.resolution_notes || '');
  };

  const handleSaveUpdate = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;

    setUpdating(true);
    try {
      const payload = {
        status: newStatus,
        comment: officerComment,
        resolution_notes: newStatus === 'Resolved' ? resolutionNotes : selectedReport.resolution_notes
      };
      const res = await reportsService.updateStatus(selectedReport.id, payload);
      setSelectedReport(res.data.report);
      setReports(reports.map(r => r.id === selectedReport.id ? res.data.report : r));
      alert(`Report status updated to '${newStatus}'.`);
    } catch (err) {
      alert('Failed to update report.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-amber-700 tracking-wider uppercase">Municipal Operations</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
          Community Problem Reports Triage
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Review reported infrastructure hazards, dispatch maintenance teams, and log resolution reports.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search problem title, location, reference code..."
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Filter Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Filter Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Filter Community</label>
            <select
              value={communityFilter}
              onChange={(e) => setCommunityFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              {communities.map(cm => <option key={cm} value={cm}>{cm}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      {loading ? (
        <LoadingSpinner message="Loading community reports..." />
      ) : reports.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No problem reports found"
          description="There are currently no reports matching your selected filter criteria."
        />
      ) : (
        <div className="space-y-3">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    {rep.reference_code}
                  </span>
                  <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {rep.category}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(rep.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {rep.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{rep.location_name} ({rep.community_area})</span>
                  </span>
                  <span>&bull;</span>
                  <span>Reporter: {rep.reporter_name}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <StatusBadge status={rep.status} size="sm" />
                <button
                  type="button"
                  onClick={() => openUpdateModal(rep)}
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-all shadow-sm flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Update Status</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Modal */}
      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title={`Update Report: ${selectedReport?.reference_code}`}
        maxWidth="max-w-2xl"
      >
        {selectedReport && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-amber-800">{selectedReport.reference_code} &bull; {selectedReport.category}</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedReport.title}</h3>
              </div>
              <StatusBadge status={selectedReport.status} size="sm" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Description</span>
              <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl leading-relaxed">
                {selectedReport.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 text-[10px] block">Location Landmark</span>
                <span className="font-semibold text-slate-800">{selectedReport.location_name}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Community / Town</span>
                <span className="font-semibold text-slate-800">{selectedReport.community_area}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Reporter Contact</span>
                <span className="font-semibold text-slate-800">{selectedReport.reporter_name} ({selectedReport.reporter_phone || 'No phone'})</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Date Reported</span>
                <span className="font-semibold text-slate-800">{new Date(selectedReport.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {selectedReport.image_url && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Evidence Photo</span>
                <div className="rounded-xl overflow-hidden border border-slate-200 max-h-48">
                  <img src={selectedReport.image_url} alt="Problem evidence" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {/* Action Form */}
            <form onSubmit={handleSaveUpdate} className="pt-4 border-t border-slate-200 space-y-4 bg-slate-50 p-4 rounded-2xl border">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-civic-700" />
                <span>Field Officer Action & Status</span>
              </h4>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Transition *</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl font-semibold"
                >
                  <option value="Submitted">Submitted (Unassigned)</option>
                  <option value="Under Review">Under Review (Desk Triage)</option>
                  <option value="Assigned">Assigned to Field Team</option>
                  <option value="In Progress">In Progress (Work Underway)</option>
                  <option value="Resolved">Resolved (Work Completed)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Update Comment</label>
                <input
                  type="text"
                  value={officerComment}
                  onChange={(e) => setOfficerComment(e.target.value)}
                  placeholder="e.g. Field crew dispatched to clear the drainage canal."
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                />
              </div>

              {newStatus === 'Resolved' && (
                <div>
                  <label className="block text-xs font-bold text-emerald-800 mb-1">Final Resolution Notes *</label>
                  <textarea
                    required
                    rows={3}
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Describe the completed civil works or environmental cleanup executed by council teams..."
                    className="w-full px-3.5 py-2 text-xs bg-white border border-emerald-300 rounded-xl"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2 bg-civic-800 hover:bg-civic-900 text-white font-bold text-xs rounded-xl transition-all shadow disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save & Notify Citizen'}
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StaffReportsPage;
