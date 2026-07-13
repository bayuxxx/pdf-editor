import React from 'react';
import { CheckCircle, X, Info } from 'lucide-react';

interface StatusToastProps {
  statusMessage: { text: string; type: 'info' | 'success' | 'error' } | null;
}

export const StatusToast: React.FC<StatusToastProps> = ({ statusMessage }) => {
  if (!statusMessage) return null;

  return (
    <div className={`p-4 rounded-xl border flex items-start space-x-3 transition-all ${
      statusMessage.type === 'success' 
        ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
        : statusMessage.type === 'error' 
        ? 'bg-rose-50 border-rose-200 text-rose-800' 
        : 'bg-blue-50 border-blue-200 text-blue-800'
    }`}>
      {statusMessage.type === 'success' ? (
        <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
      ) : statusMessage.type === 'error' ? (
        <X className="h-5 w-5 shrink-0 text-rose-600" />
      ) : (
        <Info className="h-5 w-5 shrink-0 text-blue-600" />
      )}
      <span className="text-sm font-medium">{statusMessage.text}</span>
    </div>
  );
};
