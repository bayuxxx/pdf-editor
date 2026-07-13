import React from 'react';
import { PageCard } from '../components/PageCard';
import { FileList } from '../components/FileList';
import type { PDFPageItem, LoadedFile } from '../types';
import { Download, Trash2, HelpCircle } from 'lucide-react';

interface EditorPageProps {
  files: LoadedFile[];
  pages: PDFPageItem[];
  draggedIndex: number | null;
  dragOverIndex: number | null;
  handleDragStart: (index: number) => void;
  handleDragOver: (e: React.DragEvent, index: number) => void;
  handleDrop: (e: React.DragEvent, index: number) => void;
  setDraggedIndex: (index: number | null) => void;
  setDragOverIndex: (index: number | null) => void;
  setPreviewPage: (page: PDFPageItem | null) => void;
  rotatePage: (index: number) => void;
  deletePage: (index: number) => void;
  movePage: (index: number, direction: 'up' | 'down') => void;
  exportPDFs: (mode: string) => void;
  clearAll: () => void;
  formatBytes: (bytes: number) => string;
}

export const EditorPage: React.FC<EditorPageProps> = ({
  files,
  pages,
  draggedIndex,
  dragOverIndex,
  handleDragStart,
  handleDragOver,
  handleDrop,
  setDraggedIndex,
  setDragOverIndex,
  setPreviewPage,
  rotatePage,
  deletePage,
  movePage,
  exportPDFs,
  clearAll,
  formatBytes
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
      {/* Left sidebar: File list & Actions */}
      <div className="w-full lg:w-80 bg-white border border-slate-200 rounded-2xl p-6 shrink-0 shadow-sm flex flex-col gap-6">
        <FileList files={files} formatBytes={formatBytes} />

        {/* Action Section */}
        <div className="border-t border-slate-100 pt-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Ekspor / Download</h3>
          
          <div className="bg-slate-50 p-4 rounded-xl space-y-2 mb-4">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-medium">Total Halaman:</span>
              <span className="font-bold text-slate-800">{pages.length} Halaman</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => exportPDFs('merge-all')}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm shadow-md transition cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Unduh PDF</span>
            </button>

            <button
              onClick={clearAll}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl text-sm transition cursor-pointer"
            >
              <Trash2 className="h-4 w-4 text-slate-400" />
              <span>Reset Semua</span>
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-start space-x-2 text-xs text-slate-500 bg-slate-50/50 p-3 rounded-xl">
            <HelpCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed space-y-1">
              <p><strong>Cara Mengedit & Menggabung:</strong></p>
              <p>Seret (drag & drop) halaman PDF untuk memindahkan urutannya. Gunakan tombol melayang untuk memutar atau menghapus halaman.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Layout Grid */}
      <div className="flex-1 w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 m-0">Tata Letak Halaman</h2>
            <p className="text-xs text-slate-500 m-0">Atur halaman di bawah ini sesuka Anda</p>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            {pages.length} Halaman Siap
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
          {pages.map((page, index) => {
            const isDragged = draggedIndex === index;
            const isDragOver = dragOverIndex === index;

            return (
              <PageCard
                key={page.id}
                page={page}
                index={index}
                isDragged={isDragged}
                isDragOver={isDragOver}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={() => {
                  setDraggedIndex(null);
                  setDragOverIndex(null);
                }}
                onPreview={() => setPreviewPage(page)}
                onRotate={() => rotatePage(index)}
                onDelete={() => deletePage(index)}
                onMoveUp={() => movePage(index, 'up')}
                onMoveDown={() => movePage(index, 'down')}
                isFirst={index === 0}
                isLast={index === pages.length - 1}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
