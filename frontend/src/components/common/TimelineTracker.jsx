import React from 'react';
import { Check, Clock, AlertCircle, XCircle } from 'lucide-react';

const defaultSteps = [
  'Submitted',
  'Under Review',
  'Processing',
  'Approved / Decision',
  'Completed'
];

const TimelineTracker = ({ 
  currentStatus, 
  currentIndex = 0, 
  customSteps = null, 
  history = [] 
}) => {
  const steps = customSteps || defaultSteps;
  const isRejected = currentStatus === 'Rejected';

  return (
    <div className="w-full py-4">
      {/* Horizontal step progress bar for desktop, vertical on mobile */}
      <div className="hidden md:flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
        
        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex || (idx === currentIndex && (currentStatus === 'Approved' || currentStatus === 'Completed'));
          const isCurrent = idx === currentIndex && !isCompleted;
          const isStepRejected = isRejected && idx === currentIndex;

          return (
            <div key={step} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${
                  isStepRejected
                    ? 'bg-rose-600 text-white ring-4 ring-rose-100'
                    : isCompleted
                    ? 'bg-civic-700 text-white ring-4 ring-civic-100'
                    : isCurrent
                    ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {isStepRejected ? (
                  <XCircle className="w-5 h-5" />
                ) : isCompleted ? (
                  <Check className="w-5 h-5 stroke-[2.5]" />
                ) : isCurrent ? (
                  <Clock className="w-5 h-5" />
                ) : (
                  <span>0{idx + 1}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs font-semibold text-center max-w-[100px] leading-tight ${
                  isStepRejected
                    ? 'text-rose-700 font-bold'
                    : isCompleted || isCurrent
                    ? 'text-slate-900 font-bold'
                    : 'text-slate-400'
                }`}
              >
                {isStepRejected && idx === currentIndex ? 'Rejected' : step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical View */}
      <div className="md:hidden space-y-3">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex || (idx === currentIndex && (currentStatus === 'Approved' || currentStatus === 'Completed'));
          const isCurrent = idx === currentIndex && !isCompleted;
          const isStepRejected = isRejected && idx === currentIndex;

          return (
            <div key={step} className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  isStepRejected
                    ? 'bg-rose-600 text-white'
                    : isCompleted
                    ? 'bg-civic-700 text-white'
                    : isCurrent
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isStepRejected ? (
                  <XCircle className="w-4 h-4" />
                ) : isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <div className="text-xs">
                <p className={`font-semibold ${isStepRejected ? 'text-rose-600' : isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
                  {isStepRejected && idx === currentIndex ? 'Rejected' : step}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* History log entries if provided */}
      {history && history.length > 0 && (
        <div className="mt-8 border-t border-slate-200 pt-5">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Activity Timeline & Status History
          </h4>
          <div className="space-y-3">
            {history.map((h, i) => (
              <div key={i} className="flex items-start gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                <div className="w-2 h-2 rounded-full bg-civic-600 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-bold text-slate-800">{h.status}</span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {h.created_at ? new Date(h.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
                    </span>
                  </div>
                  {h.notes && <p className="text-slate-600 mt-1 leading-relaxed">{h.notes}</p>}
                  {h.changed_by_name && (
                    <p className="text-[11px] text-slate-400 mt-1">Logged by: {h.changed_by_name}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineTracker;
