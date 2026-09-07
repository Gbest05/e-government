import React, { useState, useEffect } from 'react';
import { complaintsService } from '../../services/api';
import { MessageSquare, Plus, CheckCircle2, Clock, Eye, AlertCircle, FileText, Send } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const [form, setForm] = useState({
    subject: '',
    category: 'Service Delay',
    description: '',
    related_application_ref: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const categories = [
    'Service Delay',
    'Staff Conduct',
    'Application Issue',
    'Fee Issue',
    'Facility Maintenance',
    'Other'
  ];

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await complaintsService.getComplaints({});
      setComplaints(res.data.complaints || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      await complaintsService.submitComplaint(form);
      setShowNewModal(false);
      setForm({ subject: '', category: 'Service Delay', description: '', related_application_ref: '' });
      fetchComplaints();
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Failed to lodge complaint.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-rose-700 tracking-wider uppercase">Citizen Redress & Oversight</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            My Complaints & Grievances
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Lodge service complaints or report operational delays for review by council administrators.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Lodge a Complaint</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading your complaints..." />
      ) : complaints.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No complaints filed"
          description="Have you experienced delays or discrepancies with a government service? You can lodge a formal grievance."
          action={
            <button
              onClick={() => setShowNewModal(true)}
              className="px-4 py-2 bg-rose-700 text-white text-xs font-semibold rounded-lg hover:bg-rose-800"
            >
              Lodge Complaint
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                    {c.reference_code}
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {c.category}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug truncate">
                  {c.subject}
                </h3>

                {c.related_application_ref && (
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Related Request: <strong className="font-mono">{c.related_application_ref}</strong></span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <StatusBadge status={c.status} size="sm" />
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(c)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lodge Complaint Modal */}
      <Modal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        title="Lodge Formal Service Complaint"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Complaint Subject *</label>
            <input
              type="text"
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="e.g. Unjustified delay in trade permit review"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500 text-slate-800"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Related Reference (Optional)</label>
              <input
                type="text"
                value={form.related_application_ref}
                onChange={(e) => setForm({ ...form, related_application_ref: e.target.value })}
                placeholder="e.g. RMN-2026-00125"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none uppercase font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description of Grievance *</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Provide exact facts, dates, officers interacted with, and details of the issue..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowNewModal(false)}
              className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold shadow disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Complaint Modal */}
      <Modal
        isOpen={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        title={`Complaint: ${selectedComplaint?.reference_code}`}
        maxWidth="max-w-2xl"
      >
        {selectedComplaint && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-rose-700 block">
                  {selectedComplaint.reference_code} &bull; {selectedComplaint.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedComplaint.subject}
                </h3>
              </div>
              <StatusBadge status={selectedComplaint.status} size="sm" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Description</span>
              <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl leading-relaxed">
                {selectedComplaint.description}
              </p>
            </div>

            {selectedComplaint.resolution_notes && (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-950 space-y-1">
                <span className="font-bold text-xs uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Resolution & Council Response
                </span>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  {selectedComplaint.resolution_notes}
                </p>
              </div>
            )}

            {/* Updates Timeline */}
            {selectedComplaint.updates && selectedComplaint.updates.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Case History</span>
                <div className="space-y-2">
                  {selectedComplaint.updates.map((u) => (
                    <div key={u.id} className="p-3 bg-slate-50 rounded-xl text-xs border border-slate-100">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>{u.status}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {new Date(u.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{u.comment}</p>
                    </div>
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

export default ComplaintsPage;
