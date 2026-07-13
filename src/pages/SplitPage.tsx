import React from 'react';
import { PageCard } from '../components/PageCard';
import { FileList } from '../components/FileList';
import type { PDFPageItem, LoadedFile, Section, SectionGroup } from '../types';
import { Download, Trash2, HelpCircle, Scissors, FolderOpen, RotateCw } from 'lucide-react';

interface SplitPageProps {
  files: LoadedFile[];
  pages: PDFPageItem[];
  sections: Section[];
  sectionGroups: SectionGroup[];
  draggedIndex: number | null;
  dragOverIndex: number | null;
  splitRangeStart: string;
  splitRangeEnd: string;
  setSplitRangeStart: (val: string) => void;
  setSplitRangeEnd: (val: string) => void;
  handleDragStart: (index: number) => void;
  handleDragOver: (e: React.DragEvent, index: number) => void;
  handleDrop: (e: React.DragEvent, index: number) => void;
  setDraggedIndex: (index: number | null) => void;
  setDragOverIndex: (index: number | null) => void;
  setPreviewPage: (page: PDFPageItem | null) => void;
  rotatePage: (index: number) => void;
  deletePage: (index: number) => void;
  movePage: (index: number, direction: 'up' | 'down') => void;
  toggleSplitPoint: (index: number) => void;
  renameSection: (id: string, name: string) => void;
  rotateSection: (startIndex: number, endIndex: number) => void;
  deleteSection: (id: string, startIndex: number, endIndex: number) => void;
  applyCustomSplitRange: () => void;
  exportPDFs: (mode: string) => void;
  clearAll: () => void;
  formatBytes: (bytes: number) => string;
}

export const SplitPage: React.FC<SplitPageProps> = ({
  files,
  pages,
  sections,
  sectionGroups,
  draggedIndex,
  dragOverIndex,
  splitRangeStart,
  splitRangeEnd,
  setSplitRangeStart,
  setSplitRangeEnd,
  handleDragStart,
  handleDragOver,
  handleDrop,
  setDraggedIndex,
  setDragOverIndex,
  setPreviewPage,
  rotatePage,
  deletePage,
  movePage,
  toggleSplitPoint,
  renameSection,
  rotateSection,
  deleteSection,
  applyCustomSplitRange,
  exportPDFs,
  clearAll,
  formatBytes
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
      {/* Left sidebar: File list & Actions */}
      <div className="w-full lg:w-80 bg-white border border-slate-200 rounded-2xl p-6 shrink-0 shadow-sm flex flex-col gap-6">
        <FileList files={files} formatBytes={formatBytes} />

        {/* Custom Range Split */}
        <div className="border-t border-slate-100 pt-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Custom Rentang Split</h3>
          <div className="space-y-3 mb-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="text-[10px] text-slate-500 font-medium">Buat bagian terpisah untuk rentang halaman tertentu (contoh: 20-30).</p>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Mulai"
                value={splitRangeStart}
                onChange={(e) => setSplitRangeStart(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-center"
                min={1}
                max={pages.length}
              />
              <span className="text-xs text-slate-400 font-bold">-</span>
              <input
                type="number"
                placeholder="Selesai"
                value={splitRangeEnd}
                onChange={(e) => setSplitRangeEnd(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-center"
                min={1}
                max={pages.length}
              />
            </div>
            <button
              onClick={applyCustomSplitRange}
              className="w-full inline-flex items-center justify-center space-x-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg text-xs transition cursor-pointer"
            >
              <Scissors className="h-3 w-3" />
              <span>Terapkan Potongan</span>
            </button>
          </div>
        </div>

        {/* Action Section */}
        <div className="border-t border-slate-100 pt-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Ekspor / Download</h3>
          
          <div className="bg-slate-50 p-4 rounded-xl space-y-2 mb-4">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-medium">Total Halaman:</span>
              <span className="font-bold text-slate-800">{pages.length} Halaman</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-medium">Jumlah Bagian (Section):</span>
              <span className="font-bold text-slate-800 text-blue-600">{sections.length} Bagian</span>
            </div>
          </div>

          <div className="space-y-2">
            {sections.length > 1 && (
              <button
                onClick={() => exportPDFs('zip-sections')}
                className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm shadow-md transition cursor-pointer"
              >
                <Scissors className="h-4 w-4" />
                <span>Unduh Semua Bagian (.ZIP)</span>
              </button>
            )}
            
            <button
              onClick={() => exportPDFs('merge-all')}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm shadow-md transition cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Gabung & Unduh 1 PDF</span>
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

        {/* Sections list download */}
        {sections.length > 1 && (
          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Unduh Bagian Tertentu</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {sections.map((sec) => {
                const sorted = [...sections].sort((a, b) => a.startIndex - b.startIndex);
                const currentIdx = sorted.findIndex(s => s.id === sec.id);
                const next = sorted[currentIdx + 1];
                const count = pages.slice(sec.startIndex, next ? next.startIndex : pages.length).length;

                return (
                  <div key={sec.id} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    <div className="min-w-0 flex-1 pr-2">
                      <input
                        type="text"
                        value={sec.name}
                        onChange={(e) => renameSection(sec.id, e.target.value)}
                        className="font-semibold text-slate-800 bg-transparent hover:bg-slate-200/50 focus:bg-white focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 w-full border-none outline-none"
                      />
                      <p className="text-[10px] text-slate-400 font-medium px-1">
                        Halaman {sec.startIndex + 1} - {next ? next.startIndex : pages.length} ({count} hal)
                      </p>
                    </div>
                    <button
                      onClick={() => exportPDFs(sec.id)}
                      className="bg-white border border-slate-200 hover:bg-slate-100 p-1.5 rounded-lg text-slate-600 hover:text-slate-900 shadow-xs shrink-0 cursor-pointer"
                      title="Unduh bagian ini saja"
                      disabled={count === 0}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-start space-x-2 text-xs text-slate-500 bg-slate-50/50 p-3 rounded-xl">
            <HelpCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed space-y-1">
              <p><strong>Cara Memisahkan Bagian:</strong></p>
              <p>Klik tombol <Scissors className="h-3 w-3 inline text-red-500" /> <strong>"Gunting"</strong> yang terletak di sela-sela halaman di bawah ini untuk membagi PDF menjadi bagian-bagian terpisah.</p>
              <p>Seret halaman antar-bagian untuk menata ulang urutannya sesuai kebutuhan Anda.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Workspaces (Split layout) */}
      <div className="flex-1 w-full flex flex-col gap-8">
        {sectionGroups.map((group) => (
          <div key={group.section.id} className="w-full">
            
            {/* Visual Section Box */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative">
              
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                    <FolderOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={group.section.name}
                      onChange={(e) => renameSection(group.section.id, e.target.value)}
                      className="font-bold text-lg text-slate-900 bg-transparent hover:bg-slate-100 focus:bg-slate-50 focus:ring-2 focus:ring-blue-500 rounded px-2 py-0.5 border-none outline-none focus:w-auto"
                      placeholder="Nama Bagian"
                    />
                    <p className="text-xs text-slate-500 px-2 mt-0.5">
                      {group.pages.length} Halaman • Halaman global {group.startIndex + 1} - {group.endIndex}
                    </p>
                  </div>
                </div>

                {/* Section Quick Actions */}
                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <button
                    onClick={() => rotateSection(group.startIndex, group.endIndex)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-semibold transition cursor-pointer"
                    title="Putar semua halaman di bagian ini"
                    disabled={group.pages.length === 0}
                  >
                    <RotateCw className="h-3.5 w-3.5 text-slate-500" />
                    <span>Putar Bagian</span>
                  </button>
                  {group.section.id !== 'default' && (
                    <button
                      onClick={() => deleteSection(group.section.id, group.startIndex, group.endIndex)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 hover:border-rose-200 text-rose-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                      title="Hapus seluruh bagian beserta halamannya"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Hapus Bagian</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Section Pages Grid */}
              {group.pages.length === 0 ? (
                <div className="py-12 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center text-slate-400">
                  <FolderOpen className="h-8 w-8 mb-2 stroke-1" />
                  <p className="text-sm font-medium">Bagian ini kosong</p>
                  <p className="text-xs">Seret halaman dari bagian lain ke sini.</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-y-6 gap-x-2 items-stretch">
                  {group.pages.map(({ page, globalIndex }, localIdx) => {
                    const isDragged = draggedIndex === globalIndex;
                    const isDragOver = dragOverIndex === globalIndex;

                    return (
                      <React.Fragment key={page.id}>
                        
                        {/* Page Card */}
                        <PageCard
                          page={page}
                          index={globalIndex}
                          isDragged={isDragged}
                          isDragOver={isDragOver}
                          onDragStart={() => handleDragStart(globalIndex)}
                          onDragOver={(e) => handleDragOver(e, globalIndex)}
                          onDrop={(e) => handleDrop(e, globalIndex)}
                          onDragEnd={() => {
                            setDraggedIndex(null);
                            setDragOverIndex(null);
                          }}
                          onPreview={() => setPreviewPage(page)}
                          onRotate={() => rotatePage(globalIndex)}
                          onDelete={() => deletePage(globalIndex)}
                          onMoveUp={() => movePage(globalIndex, 'up')}
                          onMoveDown={() => movePage(globalIndex, 'down')}
                          isFirst={globalIndex === 0}
                          isLast={globalIndex === pages.length - 1}
                          cardWidthClass="w-36 sm:w-40 shrink-0"
                        />

                        {/* Split trigger */}
                        {localIdx < group.pages.length - 1 && (
                          <div className="flex items-center justify-center px-0.5 py-2 group/split relative">
                            <div className="w-0 border-l border-dashed border-slate-300 h-full group-hover/split:border-red-400 transition-colors"></div>
                            <button
                              onClick={() => toggleSplitPoint(globalIndex + 1)}
                              className="bg-white hover:bg-red-500 text-slate-400 hover:text-white border border-slate-200 p-1.5 rounded-full shadow-xs cursor-pointer z-10 transition-colors absolute"
                              title="Potong & buat bagian baru"
                            >
                              <Scissors className="h-3 w-3" />
                            </button>
                          </div>
                        )}

                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Merge button separator */}
            {group.nextSectionStartIndex !== null && (
              <div className="flex items-center justify-center my-6 relative py-2">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-dashed border-slate-300"></div>
                </div>
                <button
                  onClick={() => toggleSplitPoint(group.nextSectionStartIndex!)}
                  className="relative inline-flex items-center space-x-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-full text-xs font-bold shadow-xs transition cursor-pointer"
                  title="Gabungkan kembali bagian"
                >
                  <Scissors className="h-3.5 w-3.5 rotate-180" />
                  <span>Gabungkan Kembali Bagian</span>
                </button>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};
