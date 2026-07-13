import React from 'react';
import { RefreshCw } from 'lucide-react';

interface LoadingOverlayProps {
  isLoading: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center space-y-4 max-w-xs w-full text-center">
        <RefreshCw className="h-10 w-10 text-red-500 animate-spin" />
        <p className="text-slate-800 font-semibold">Sedang diproses...</p>
        <p className="text-xs text-slate-500">Mohon tunggu beberapa saat untuk pemrosesan file PDF.</p>
      </div>
    </div>
  );
};
