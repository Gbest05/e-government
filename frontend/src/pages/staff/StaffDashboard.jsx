import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { staffService } from '../../services/api';
import { 
  Building2, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare, 
  ArrowRight,
  UserCheck,
  RefreshCw 
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StaffDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaffDashboard();
  }, []);

  const fetchStaffDashboard = async () => {
    setLoading(true);
    try {
      const res = await staffService.getDashboardStats();
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading department queue..." />;

  const metrics = data?.metrics || {};

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-civic-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              Government Staff Workstation
            </span>
            <span className="text-xs text-slate-400">&bull;</span>
            <span className="text-xs text-civic-300 font-semibold">{data?.department_name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Officer {user?.full_name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Manage citizen applications, perform document checks, inspect field problem reports, and update case statuses.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/staff/applications"
            className="px-4 py-2.5 bg-civic-600 hover:bg-civic-500 text-white text-xs font-bold rounded-xl transition-all shadow"
          >
            Review Applications
          </Link>
          <Link
            to="/staff/reports"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold rounded-xl border border-slate-700 transition-all"
          >
            Resolve Reports
          </Link>
        </div>
      </div>

      {/* Department KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Assigned Cases', val: metrics.total_cases, icon: FileText, color: 'text-blue-600 bg-blue-50' },
          { label: 'Pending Review', val: metrics.pending_cases, icon: Clock, color: 'text-amber-600 bg-amber-50' },
          { label: 'In Progress', val: metrics.in_progress_cases, icon: RefreshCw, color: 'text-purple-600 bg-purple-50' },
          { label: 'Completed', val: metrics.completed_cases, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Active Reports', val: metrics.active_reports, icon: AlertTriangle, color: 'text-rose-600 bg-rose-50' },
          { label: 'Complaints', val: metrics.active_complaints, icon: MessageSquare, color: 'text-indigo-600 bg-indigo-50' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 block leading-none">
                  {item.val || 0}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 block mt-1 leading-tight">
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Department Queues Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Applications Queue */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-civic-700" />
              <span>Applications Awaiting Action</span>
            </h3>
            <Link
              to="/staff/applications"
              className="text-xs font-bold text-civic-700 hover:text-civic-900 flex items-center gap-1"
            >
              <span>Full Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {(!data?.recent_applications || data.recent_applications.length === 0) ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No applications currently queued in your department.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {data.recent_applications.map((app) => (
                <div key={app.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono font-bold text-slate-400 block">
                      {app.reference_number} &bull; {app.applicant_name}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 truncate">
                      {app.service_name}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Submitted: {new Date(app.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <StatusBadge status={app.status} size="sm" />
                    <Link
                      to="/staff/applications"
                      className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                    >
                      Process
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Community Reports Queue */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Community Reports in Department</span>
            </h3>
            <Link
              to="/staff/reports"
              className="text-xs font-bold text-civic-700 hover:text-civic-900 flex items-center gap-1"
            >
              <span>Full Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {(!data?.recent_reports || data.recent_reports.length === 0) ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No unresolved community reports assigned.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {data.recent_reports.map((rep) => (
                <div key={rep.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono font-bold text-slate-400 block">
                      {rep.reference_code} &bull; {rep.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 truncate">
                      {rep.title}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {rep.location_name} ({rep.community_area})
                    </span>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <StatusBadge status={rep.status} size="sm" />
                    <Link
                      to="/staff/reports"
                      className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                    >
                      Update
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
