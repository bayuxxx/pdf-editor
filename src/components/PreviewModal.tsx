import React from 'react';
import { X, RotateCw, Trash2 } from 'lucide-react';
import type { PDFPageItem } from '../types';

interface PreviewModalProps {
  previewPage: PDFPageItem | null;
  onClose: () => void;
  onRotate: () => void;
  onDelete: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  previewPage,
  onClose,
  onRotate,
  onDelete
}) => {
  if (!previewPage) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden max-h-[90vh] scale-100 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-white shadow-xs">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 truncate max-w-md">{previewPage.fileName}</h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Halaman Asli: {previewPage.originalPageNumber + 1}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition cursor-pointer border border-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-12 flex items-center justify-center bg-slate-100/50 min-h-[50vh]">
          <div className="shadow-2xl rounded-2xl border border-slate-200 bg-white p-3 max-w-full max-h-[60vh] flex items-center justify-center">
            <img
              src={previewPage.thumbnailUrl}
              alt="Detail Halaman"
              className="max-w-full max-h-[55vh] object-contain rounded-lg transition-transform duration-300"
              style={{
                transform: `rotate(${previewPage.rotation}deg)`,
              }}
            />
          </div>
        </div>
        <div className="p-5 border-t border-slate-200 bg-white flex justify-between gap-4">
          <button
            onClick={onRotate}
            className="flex-1 inline-flex items-center justify-center space-x-2 px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl text-sm font-bold transition cursor-pointer"
          >
            <RotateCw className="h-4 w-4" />
            <span>Putar 90°</span>
          </button>
          <button
            onClick={onDelete}
            className="flex-1 inline-flex items-center justify-center space-x-2 px-5 py-3 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-700 rounded-xl text-sm font-bold transition cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            <span>Hapus Halaman</span>
          </button>
        </div>
      </div>
    </div>
  );
};
