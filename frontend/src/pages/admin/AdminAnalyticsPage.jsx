import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { BarChart3, TrendingUp, Users, FileText, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminAnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboardStats().then(res => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner message="Computing analytics metrics..." />;

  const m = data?.metrics || {};
  const charts = data?.charts || {};

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold text-civic-700 tracking-wider uppercase">Business Intelligence</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
          Council Reports & Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Executive data summaries on service volume, turnaround velocity, and community issue categories.
        </p>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Service Requests</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{m.total_applications}</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Across 10 electoral wards in Remo North.</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Approval Rate</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-700">
              {m.total_applications > 0 ? Math.round(((m.approved_applications + m.completed_applications) / m.total_applications) * 100) : 100}%
            </span>
            <span className="text-xs font-bold text-emerald-600">Standard</span>
          </div>
          <p className="text-[11px] text-slate-500">Document authentication compliance.</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Report Resolution</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-600">
              {m.total_reports > 0 ? Math.round((m.resolved_reports / m.total_reports) * 100) : 100}%
            </span>
            <span className="text-xs font-bold text-amber-600">Active Tasks</span>
          </div>
          <p className="text-[11px] text-slate-500">Public works and sanitation repairs.</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Citizen Base</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{m.total_citizens}</span>
            <span className="text-xs font-bold text-blue-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> Growth
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Verified residential profiles.</p>
        </div>
      </div>

      {/* Visual Bars Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            Service Distribution by Demand
          </h3>
          <div className="space-y-3">
            {charts.apps_by_service?.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{s.name}</span>
                  <span className="font-mono text-slate-900">{s.count} requests</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-civic-700 rounded-full"
                    style={{ width: `${Math.max((s.count / Math.max(...charts.apps_by_service.map(x => x.count), 1)) * 100, 8)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            Citizen Grievances by Category
          </h3>
          <div className="space-y-3">
            {charts.complaints_by_category?.map((c, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{c.category}</span>
                  <span className="font-mono text-slate-900">{c.count} complaints</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: `${Math.max((c.count / Math.max(...charts.complaints_by_category.map(x => x.count), 1)) * 100, 8)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
