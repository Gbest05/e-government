import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportsService } from '../../services/api';
import { 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Eye, 
  Search,
  Building2 
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';

const MyReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
    setLoading(true);
    try {
      const res = await reportsService.getReports({ mine: true });
      setReports(res.data.reports || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-700 tracking-wider uppercase">Civic Infrastructure</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            My Community Problem Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track status updates and council taskforce resolutions for issues you reported.
          </p>
        </div>

        <Link
          to="/citizen/report"
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Report New Problem</span>
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching your community reports..." />
      ) : reports.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No problem reports submitted yet"
          description="Have you noticed damaged roads, flood debris, or unlit streetlights in your area? Report them to council engineers."
          action={
            <Link
              to="/citizen/report"
              className="px-4 py-2 bg-civic-800 text-white text-xs font-semibold rounded-lg"
            >
              Report an Issue
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    {rep.reference_code}
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {rep.category}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(rep.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug truncate">
                  {rep.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{rep.location_name} ({rep.community_area})</span>
                  </span>
                  {rep.assigned_department_name && (
                    <>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Assigned: {rep.assigned_department_name}</span>
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <StatusBadge status={rep.status} size="sm" />
                <button
                  type="button"
                  onClick={() => setSelectedReport(rep)}
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

      {/* Report Inspection Modal */}
      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title={`Report: ${selectedReport?.reference_code}`}
        maxWidth="max-w-2xl"
      >
        {selectedReport && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-amber-700 block">
                  {selectedReport.reference_code} &bull; {selectedReport.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedReport.title}
                </h3>
              </div>
              <StatusBadge status={selectedReport.status} size="md" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Description
              </span>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
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
                <span className="text-slate-400 text-[10px] block">Assigned Department</span>
                <span className="font-semibold text-slate-800">{selectedReport.assigned_department_name || 'Triage'}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Date Reported</span>
                <span className="font-semibold text-slate-800">{new Date(selectedReport.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {selectedReport.image_url && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Attached Photo</span>
                <div className="rounded-xl overflow-hidden border border-slate-200 max-h-56">
                  <img src={selectedReport.image_url} alt="Report evidence" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {/* Resolution note if resolved */}
            {selectedReport.status === 'Resolved' && selectedReport.resolution_notes && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-950 space-y-1">
                <span className="font-bold text-xs uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Council Resolution Note
                </span>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  {selectedReport.resolution_notes}
                </p>
                {selectedReport.resolved_at && (
                  <span className="text-[10px] text-emerald-700 block mt-1">
                    Resolved on {new Date(selectedReport.resolved_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}

            {/* Status Update History */}
            {selectedReport.updates && selectedReport.updates.length > 0 && (
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Action Updates
                </span>
                <div className="space-y-2">
                  {selectedReport.updates.map((up) => (
                    <div key={up.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <div className="flex items-center justify-between font-semibold text-slate-800">
                        <span>{up.status}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {new Date(up.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{up.comment}</p>
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

export default MyReportsPage;
