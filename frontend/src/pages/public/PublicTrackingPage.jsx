import React, { useState } from 'react';
import { applicationsService } from '../../services/api';
import { Search, ShieldCheck, Clock, Building2, CheckCircle2, AlertCircle, FileCheck } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import TimelineTracker from '../../components/common/TimelineTracker';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PublicTrackingPage = () => {
  const [refCode, setRefCode] = useState('');
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    const cleanCode = refCode.trim().toUpperCase();
    if (!cleanCode) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const res = await applicationsService.trackByRef(cleanCode);
      setApplication(res.data.application);
    } catch (err) {
      setApplication(null);
      setError(
        err.response?.data?.error ||
        `No application found with reference number "${cleanCode}". Please verify your reference number.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-civic-700 tracking-wider uppercase">Public Verification & Tracking</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Track Application Status
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Enter your official Remo North Local Government reference number to check the live status of your application.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md mb-8">
          <form onSubmit={handleTrack} className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Application Reference Number
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={refCode}
                  onChange={(e) => setRefCode(e.target.value)}
                  placeholder="e.g. RMN-2026-00125"
                  className="w-full pl-11 pr-4 py-3.5 text-sm uppercase font-mono tracking-wider bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-civic-600 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !refCode.trim()}
                className="px-8 py-3.5 bg-civic-800 hover:bg-civic-900 text-white font-bold text-sm rounded-xl transition-all shadow shrink-0 disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Track Application'}
              </button>
            </div>
          </form>

          {/* Sample quick test button */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-400">
            <span>Don't have a code handy? Try demo reference:</span>
            <button
              type="button"
              onClick={() => {
                setRefCode('RMN-2026-00125');
              }}
              className="text-civic-700 hover:text-civic-900 font-mono font-bold underline"
            >
              RMN-2026-00125 (Approved Origin Cert)
            </button>
          </div>
        </div>

        {/* Results Area */}
        {loading && <LoadingSpinner message="Querying municipal registry records..." />}

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-6 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <h3 className="text-sm font-bold">Reference Number Not Found</h3>
            <p className="text-xs text-rose-600 max-w-md mx-auto">{error}</p>
          </div>
        )}

        {application && !loading && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Safe Summary Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold text-civic-800 bg-civic-50 px-2.5 py-1 rounded-md border border-civic-200">
                  {application.reference_number}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                  {application.service_name}
                </h2>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Processing Department: <strong>{application.department_name}</strong></span>
                </p>
              </div>

              <div className="text-right sm:text-left shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Current Status</span>
                <StatusBadge status={application.status} size="lg" />
              </div>
            </div>

            {/* Visual Stepper */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
                Lifecycle Progression
              </h3>
              <TimelineTracker
                currentStatus={application.status}
                currentIndex={application.current_step_index}
                customSteps={application.processing_steps}
                history={application.status_history}
              />
            </div>

            {/* Approved Certificate Slip Box if approved */}
            {application.certificate_code && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-900 block">
                      Digital Certificate Issued & Verified
                    </span>
                    <span className="font-mono text-sm font-black text-emerald-800">
                      Certificate No: {application.certificate_code}
                    </span>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      Authorized by Council Secretariat, Remo North LGA.
                    </p>
                  </div>
                </div>

                <div className="text-xs font-semibold text-emerald-800 bg-white px-3 py-1.5 rounded-lg border border-emerald-300">
                  Status: Official & Valid
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="text-[11px] text-slate-400 bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Public Privacy Protocol: Confidential personal applicant details (residential address, phone numbers, and identity documents) are protected and only accessible to verified council staff and the authenticated applicant.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicTrackingPage;
