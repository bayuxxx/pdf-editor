import React from 'react';
import { Eye, RotateCw, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import type { PDFPageItem } from '../types';

interface PageCardProps {
  page: PDFPageItem;
  index: number;
  isDragged: boolean;
  isDragOver: boolean;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onPreview: () => void;
  onRotate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  cardWidthClass?: string;
}

export const PageCard: React.FC<PageCardProps> = ({
  page,
  index,
  isDragged,
  isDragOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onPreview,
  onRotate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  cardWidthClass = ''
}) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`group relative border rounded-xl bg-slate-50 flex flex-col p-2.5 transition-all select-none ${cardWidthClass} ${
        isDragged ? 'opacity-30 border-blue-500 bg-blue-50/20' : ''
      } ${
        isDragOver ? 'border-dashed border-red-500 scale-105 bg-red-50/10' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Action overlay */}
      <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity z-10">
        <button
          onClick={onPreview}
          className="bg-white border border-slate-200 p-1.5 rounded-lg text-slate-600 hover:text-slate-900 shadow-xs cursor-pointer"
          title="Lihat Detail Halaman"
        >
          <Eye className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onRotate}
          className="bg-white border border-slate-200 p-1.5 rounded-lg text-slate-600 hover:text-slate-900 shadow-xs cursor-pointer"
          title="Putar 90°"
        >
          <RotateCw className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="bg-white border border-slate-200 p-1.5 rounded-lg text-red-500 hover:text-red-700 shadow-xs cursor-pointer"
          title="Hapus Halaman"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Thumbnail */}
      <div className="aspect-3/4 bg-white border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden relative cursor-grab active:cursor-grabbing mb-3 h-48">
        <img
          src={page.thumbnailUrl}
          alt={`Halaman ${index + 1}`}
          className="max-h-full max-w-full object-contain transition-transform"
          style={{
            transform: `rotate(${page.rotation}deg)`,
          }}
        />
        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-900/70 backdrop-blur-xs text-white rounded text-[10px] font-bold">
          {index + 1}
        </div>
      </div>

      {/* Source info */}
      <div className="mt-auto">
        <p className="text-[10px] font-bold text-slate-800 truncate" title={page.fileName}>
          {page.fileName}
        </p>
        <p className="text-[9px] text-slate-400 font-medium">
          Hal Asli: {page.originalPageNumber + 1}
        </p>
      </div>

      {/* Shift triggers */}
      <div className="mt-2.5 pt-2 border-t border-slate-200 flex justify-between items-center gap-1.5">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="flex-1 py-1 rounded bg-slate-100 text-slate-500 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 flex items-center justify-center cursor-pointer"
          title="Pindah Kiri/Atas"
        >
          <ChevronUp className="h-3.5 w-3.5 rotate-270" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="flex-1 py-1 rounded bg-slate-100 text-slate-500 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 flex items-center justify-center cursor-pointer"
          title="Pindah Kanan/Bawah"
        >
          <ChevronDown className="h-3.5 w-3.5 rotate-270" />
        </button>
      </div>
    </div>
  );
};
