import React, { useState, useEffect } from 'react';
import { complaintsService } from '../../services/api';
import { MessageSquare, Search, Clock, CheckCircle2, Eye, UserCheck } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';

const StaffComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected complaint for resolution
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [officerComment, setOfficerComment] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const statuses = ['All', 'Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'];

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await complaintsService.getComplaints({ status: statusFilter, search: searchTerm });
      setComplaints(res.data.complaints || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (comp) => {
    setSelectedComplaint(comp);
    setNewStatus(comp.status);
    setOfficerComment('');
    setResolutionNotes(comp.resolution_notes || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setUpdating(true);
    try {
      const payload = {
        status: newStatus,
        comment: officerComment,
        resolution_notes: resolutionNotes
      };
      const res = await complaintsService.updateStatus(selectedComplaint.id, payload);
      setSelectedComplaint(res.data.complaint);
      setComplaints(complaints.map(c => c.id === selectedComplaint.id ? res.data.complaint : c));
      alert(`Complaint status updated to '${newStatus}'.`);
    } catch (err) {
      alert('Failed to update complaint.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-rose-700 tracking-wider uppercase">Administrative Oversight</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
          Citizen Complaints Resolution
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Investigate reported service delays, conduct complaints, and communicate official council redress.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <form onSubmit={(e) => { e.preventDefault(); fetchComplaints(); }} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search complaint code, subject, citizen name..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-slate-800 text-white font-semibold text-xs rounded-xl hover:bg-slate-900"
          >
            Filter
          </button>
        </form>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-slate-100 pt-2.5 scrollbar-none">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-rose-700 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching complaints..." />
      ) : complaints.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No complaints in queue"
          description="There are currently no citizen complaints matching your filter criteria."
        />
      ) : (
        <div className="space-y-3">
          {complaints.map((comp) => (
            <div
              key={comp.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                    {comp.reference_code}
                  </span>
                  <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {comp.category}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(comp.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {comp.subject}
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                  <span>Complainant: <strong>{comp.citizen_name}</strong></span>
                  <span>&bull;</span>
                  <span>Phone: {comp.citizen_phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <StatusBadge status={comp.status} size="sm" />
                <button
                  type="button"
                  onClick={() => openModal(comp)}
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-all shadow-sm flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Investigate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Investigation Modal */}
      <Modal
        isOpen={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        title={`Investigate Complaint: ${selectedComplaint?.reference_code}`}
        maxWidth="max-w-2xl"
      >
        {selectedComplaint && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-rose-700">{selectedComplaint.reference_code}</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedComplaint.subject}</h3>
                <p className="text-xs text-slate-400">Citizen: <strong>{selectedComplaint.citizen_name}</strong> ({selectedComplaint.citizen_phone})</p>
              </div>
              <StatusBadge status={selectedComplaint.status} size="sm" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Grievance Statement</span>
              <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl leading-relaxed">
                {selectedComplaint.description}
              </p>
            </div>

            {selectedComplaint.related_application_ref && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <span className="text-slate-400 block text-[10px]">Associated Request Code:</span>
                <strong className="font-mono text-slate-800">{selectedComplaint.related_application_ref}</strong>
              </div>
            )}

            {/* Action Form */}
            <form onSubmit={handleUpdate} className="pt-4 border-t border-slate-200 space-y-4 bg-slate-50 p-4 rounded-2xl border">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-rose-700" />
                <span>Officer Redress Action</span>
              </h4>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Transition *</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl font-semibold"
                >
                  <option value="Submitted">Submitted (Unassigned)</option>
                  <option value="Under Review">Under Review (Investigating)</option>
                  <option value="Assigned">Assigned to Supervisory Officer</option>
                  <option value="In Progress">In Progress (Rectification Ongoing)</option>
                  <option value="Resolved">Resolved (Redress Executed)</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Update Comment</label>
                <input
                  type="text"
                  value={officerComment}
                  onChange={(e) => setOfficerComment(e.target.value)}
                  placeholder="e.g. Finance desk reconciled payment receipt."
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Final Resolution Notes</label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Official resolution summary communicated to the complainant..."
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all shadow disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save & Send Redress Note'}
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StaffComplaintsPage;
