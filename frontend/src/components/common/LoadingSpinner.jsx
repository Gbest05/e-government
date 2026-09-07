import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading records...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 space-y-3">
      <Loader2 className="w-8 h-8 text-civic-700 animate-spin" />
      <p className="text-xs font-semibold text-slate-500">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
