import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  UserCheck, 
  Flag 
} from 'lucide-react';

const statusConfig = {
  'Submitted': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: Clock
  },
  'Under Review': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: AlertCircle
  },
  'Processing': {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    icon: RefreshCw
  },
  'Assigned': {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    icon: UserCheck
  },
  'In Progress': {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-300',
    icon: RefreshCw
  },
  'Approved': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: CheckCircle2
  },
  'Completed': {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-300',
    icon: CheckCircle2
  },
  'Resolved': {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-300',
    icon: CheckCircle2
  },
  'Rejected': {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    icon: XCircle
  },
  'Closed': {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
    icon: Flag
  }
};

const StatusBadge = ({ status, size = 'md' }) => {
  const config = statusConfig[status] || {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    icon: Clock
  };

  const Icon = config.icon;
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs gap-1' 
    : 'px-2.5 py-1 text-xs sm:text-sm gap-1.5 font-medium';

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
