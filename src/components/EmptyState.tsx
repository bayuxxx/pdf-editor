import React from 'react';
import { Upload } from 'lucide-react';

interface EmptyStateProps {
  onUploadClick: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onUploadClick }) => {
  return (
    <div className="flex-1 border-2 border-dashed border-slate-300 rounded-3xl bg-white p-12 flex flex-col items-center justify-center text-center shadow-xs">
      <div className="bg-red-50 p-6 rounded-full mb-4">
        <Upload className="h-12 w-12 text-red-500" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">Unggah Dokumen PDF Anda</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6">
        Pilih satu atau beberapa file PDF dari komputer Anda. Anda dapat mengatur ulang urutan halaman dengan menyeretnya (drag & drop), memotong halaman menjadi beberapa bagian (Split Section), atau memutarnya.
      </p>
      <button
        onClick={onUploadClick}
        className="inline-flex items-center space-x-2 px-6 py-3 bg-red-500 text-white hover:bg-red-600 font-semibold rounded-xl text-base shadow-lg shadow-red-500/20 transition cursor-pointer"
      >
        <Upload className="h-5 w-5" />
        <span>Pilih File PDF</span>
      </button>
    </div>
  );
};
