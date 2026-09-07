import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/api';
import { 
  Users, 
  UserCheck, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare, 
  Building2, 
  FolderOpen, 
  ArrowRight,
  TrendingUp,
  MapPin,
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  const fetchAdminDashboard = async () => {
    setLoading(true);
    try {
      const res = await adminService.getDashboardStats();
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Aggregating council metrics & analytics..." />;

  const m = data?.metrics || {};
  const charts = data?.charts || {};

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-civic-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              Executive Council Headquarters
            </span>
            <span className="text-xs text-slate-400">&bull;</span>
            <span className="text-xs text-civic-300 font-semibold">Remo North LGA, Ogun State</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Administrative Management Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Real-time executive oversight of municipal services, citizen requests, staff workflows, and community infrastructure reports across all 10 wards.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/admin/services"
            className="px-4 py-2.5 bg-civic-600 hover:bg-civic-500 text-white text-xs font-bold rounded-xl shadow transition-all"
          >
            Manage Services
          </Link>
          <Link
            to="/admin/map"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Reports Map</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Registered Citizens', val: m.total_citizens, icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: 'Council Staff', val: m.total_staff, icon: UserCheck, color: 'text-purple-600 bg-purple-50' },
          { label: 'Total Applications', val: m.total_applications, icon: FileText, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Pending Triage', val: m.pending_applications, icon: Clock, color: 'text-amber-600 bg-amber-50' },
          { label: 'Community Reports', val: m.total_reports, icon: AlertTriangle, color: 'text-rose-600 bg-rose-50' },
          { label: 'Council Complaints', val: m.total_complaints, icon: MessageSquare, color: 'text-indigo-600 bg-indigo-50' },
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

      {/* Visual Analytics / Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Service Demand Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-civic-700" />
              <span>Applications by Service</span>
            </h3>
            <span className="text-[10px] uppercase font-bold text-slate-400">Demand</span>
          </div>

          <div className="space-y-3">
            {charts.apps_by_service && charts.apps_by_service.map((srv, idx) => {
              const maxCount = Math.max(...charts.apps_by_service.map(s => s.count), 1);
              const percentage = Math.round((srv.count / maxCount) * 100);

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span className="truncate max-w-[200px]">{srv.name}</span>
                    <span className="font-mono text-slate-900">{srv.count}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-civic-700 rounded-full transition-all"
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Community Reports Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Reports by Category</span>
            </h3>
            <Link to="/admin/map" className="text-xs font-bold text-civic-700 hover:text-civic-900">
              View Map &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {charts.reports_by_category && charts.reports_by_category.map((cat, idx) => {
              const maxCat = Math.max(...charts.reports_by_category.map(c => c.count), 1);
              const pct = Math.round((cat.count / maxCat) * 100);

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span className="truncate">{cat.category}</span>
                    <span className="font-mono text-slate-900">{cat.count}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{ width: `${Math.max(pct, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resolution Efficiency Gauge */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Resolution Rate</span>
            </h3>
            <span className="text-[10px] uppercase font-bold text-slate-400">Taskforce</span>
          </div>

          <div className="text-center py-4 space-y-2">
            <div className="text-4xl font-black text-emerald-700">
              {m.total_reports > 0 ? Math.round((m.resolved_reports / m.total_reports) * 100) : 100}%
            </div>
            <p className="text-xs text-slate-500">
              {m.resolved_reports} of {m.total_reports} problem reports successfully resolved by council crews.
            </p>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-3 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Active Council Services:</span>
              <strong className="text-slate-900">{m.total_services}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Operational Departments:</span>
              <strong className="text-slate-900">{m.total_departments}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Resolved Complaints:</span>
              <strong className="text-slate-900">{m.resolved_complaints}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications and Reports Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-civic-700" />
              <span>Recent Applications Audited</span>
            </h3>
            <Link to="/admin/applications" className="text-xs font-bold text-civic-700 hover:text-civic-900">
              All Applications &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {data?.recent_applications && data.recent_applications.map((app) => (
              <div key={app.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <span className="font-mono font-bold text-slate-400 block text-[10px]">
                    {app.reference_number} &bull; {app.applicant_name}
                  </span>
                  <h4 className="font-bold text-slate-800 truncate">{app.service_name}</h4>
                  <span className="text-[11px] text-slate-400">{app.department_name}</span>
                </div>
                <div className="shrink-0">
                  <StatusBadge status={app.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Recent Community Reports</span>
            </h3>
            <Link to="/admin/map" className="text-xs font-bold text-civic-700 hover:text-civic-900">
              Interactive Map &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {data?.recent_reports && data.recent_reports.map((rep) => (
              <div key={rep.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <span className="font-mono font-bold text-slate-400 block text-[10px]">
                    {rep.reference_code} &bull; {rep.category}
                  </span>
                  <h4 className="font-bold text-slate-800 truncate">{rep.title}</h4>
                  <span className="text-[11px] text-slate-400">{rep.location_name} ({rep.community_area})</span>
                </div>
                <div className="shrink-0">
                  <StatusBadge status={rep.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
