import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { applicationsService, reportsService, complaintsService, notificationsService } from '../../services/api';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare, 
  Bell, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  FolderOpen
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalApps: 0,
    pendingApps: 0,
    approvedApps: 0,
    activeComplaints: 0,
    totalReports: 0,
    unreadNotifs: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [appsRes, reportsRes, complaintsRes, notifsRes] = await Promise.all([
          applicationsService.getApplications({ per_page: 5 }),
          reportsService.getReports({ mine: true, per_page: 5 }),
          complaintsService.getComplaints({ per_page: 5 }),
          notificationsService.getNotifications()
        ]);

        const apps = appsRes.data.applications || [];
        const totalApps = appsRes.data.total || 0;
        const pendingApps = apps.filter(a => ['Submitted', 'Under Review', 'Processing'].includes(a.status)).length;
        const approvedApps = apps.filter(a => ['Approved', 'Completed'].includes(a.status)).length;
        
        const reports = reportsRes.data.reports || [];
        const totalReports = reportsRes.data.total || 0;

        const complaints = complaintsRes.data.complaints || [];
        const activeComplaints = complaints.filter(c => ['Submitted', 'Under Review', 'In Progress'].includes(c.status)).length;

        setStats({
          totalApps,
          pendingApps,
          approvedApps,
          activeComplaints,
          totalReports,
          unreadNotifs: notifsRes.data.unread_count || 0
        });

        setRecentApplications(apps);
        setRecentReports(reports);
      } catch (err) {
        console.error('Failed to load citizen dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading your citizen dashboard..." />;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-civic-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Citizen Portal &bull; Remo North LGA
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.full_name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Track your pending applications, submit municipal certificates, report neighborhood issues in {user?.community_area || 'Remo North'}, and receive official council updates.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/citizen/services"
              className="px-4 py-2.5 bg-civic-600 hover:bg-civic-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Apply for Service</span>
            </Link>
            <Link
              to="/citizen/report"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Report Issue</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Applications', count: stats.totalApps, icon: FileText, color: 'text-blue-600 bg-blue-50' },
          { label: 'Pending Review', count: stats.pendingApps, icon: Clock, color: 'text-amber-600 bg-amber-50' },
          { label: 'Approved Requests', count: stats.approvedApps, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Community Reports', count: stats.totalReports, icon: AlertTriangle, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Active Complaints', count: stats.activeComplaints, icon: MessageSquare, color: 'text-rose-600 bg-rose-50' },
          { label: 'Notifications', count: stats.unreadNotifs, icon: Bell, color: 'text-purple-600 bg-purple-50' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 block leading-none">
                  {item.count}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 block mt-1 leading-tight">
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Columns: Recent Applications & Recent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-civic-700" />
              <h3 className="text-sm font-bold text-slate-900">My Recent Applications</h3>
            </div>
            <Link
              to="/citizen/applications"
              className="text-xs font-bold text-civic-700 hover:text-civic-900 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              You haven't submitted any service applications yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentApplications.map((app) => (
                <div key={app.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono font-bold text-slate-400 block">
                      {app.reference_number}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 truncate">
                      {app.service_name}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {new Date(app.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="shrink-0">
                    <StatusBadge status={app.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Problem Reports Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">My Community Reports</h3>
            </div>
            <Link
              to="/citizen/reports"
              className="text-xs font-bold text-civic-700 hover:text-civic-900 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentReports.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              You haven't reported any community issues yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentReports.map((rep) => (
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
                  <div className="shrink-0">
                    <StatusBadge status={rep.status} size="sm" />
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

export default CitizenDashboard;
