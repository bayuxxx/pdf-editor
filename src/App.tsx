import React, { useState, useRef } from 'react';
import { FileText, FilePlus } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, degrees } from 'pdf-lib';

// Set up PDF.js Worker
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

import type { PDFPageItem, LoadedFile, Section } from './types';
import { StatusToast } from './components/StatusToast';
import { LoadingOverlay } from './components/LoadingOverlay';
import { EmptyState } from './components/EmptyState';
import { PreviewModal } from './components/PreviewModal';
import { EditorPage } from './pages/EditorPage';
import { SplitPage } from './pages/SplitPage';

export default function App() {
  const [activeTab, setActiveTab] = useState<'editor' | 'split'>('editor');
  const [files, setFiles] = useState<LoadedFile[]>([]);
  const [pages, setPages] = useState<PDFPageItem[]>([]);
  const [sections, setSections] = useState<Section[]>([
    { id: 'default', name: 'Bagian 1', startIndex: 0 }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'info' | 'success' | 'error' } | null>(null);
  const [previewPage, setPreviewPage] = useState<PDFPageItem | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const [splitRangeStart, setSplitRangeStart] = useState<string>('');
  const [splitRangeEnd, setSplitRangeEnd] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Show status messages briefly
  const showStatus = (text: string, type: 'info' | 'success' | 'error' = 'info') => {
    setStatusMessage({ text, type });
    if (type !== 'error') {
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Load and render PDF pages
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;
    
    setIsLoading(true);
    showStatus('Memuat berkas PDF...', 'info');

    try {
      const newFiles: LoadedFile[] = [];
      const newPages: PDFPageItem[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
          showStatus(`File ${file.name} bukan PDF yang valid.`, 'error');
          continue;
        }

        const arrayBuffer = await file.arrayBuffer();
        const fileId = generateId();

        const typedArray = new Uint8Array(arrayBuffer.slice(0));
        const loadingTask = pdfjsLib.getDocument({ data: typedArray });
        const pdfDoc = await loadingTask.promise;
        const pageCount = pdfDoc.numPages;

        newFiles.push({
          id: fileId,
          name: file.name,
          size: file.size,
          pageCount,
          arrayBuffer: arrayBuffer.slice(0)
        });

        // Extract pages & render thumbnails
        for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
          const page = await pdfDoc.getPage(pageNum);
          const viewport = page.getViewport({ scale: 0.3 });
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          if (context) {
            await page.render({
              canvasContext: context,
              viewport: viewport
            } as any).promise;
          }

          const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);

          newPages.push({
            id: generateId(),
            fileId,
            fileName: file.name,
            originalPageNumber: pageNum - 1,
            rotation: 0,
            thumbnailUrl,
            width: viewport.width,
            height: viewport.height
          });
        }
      }

      setFiles(prev => [...prev, ...newFiles]);
      setPages(prev => [...prev, ...newPages]);
      showStatus(`Berhasil memuat ${fileList.length} file PDF!`, 'success');
    } catch (error) {
      console.error('Error loading PDF:', error);
      showStatus('Gagal memproses file PDF. Pastikan file tidak rusak.', 'error');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updatedPages = [...pages];
    const [draggedPage] = updatedPages.splice(draggedIndex, 1);
    updatedPages.splice(targetIndex, 0, draggedPage);

    setPages(updatedPages);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const movePage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pages.length) return;

    const updatedPages = [...pages];
    const [page] = updatedPages.splice(index, 1);
    updatedPages.splice(targetIndex, 0, page);
    setPages(updatedPages);
  };

  const rotatePage = (index: number) => {
    const updatedPages = [...pages];
    updatedPages[index] = {
      ...updatedPages[index],
      rotation: (updatedPages[index].rotation + 90) % 360
    };
    setPages(updatedPages);
  };

  const deletePage = (index: number) => {
    const updatedPages = [...pages];
    updatedPages.splice(index, 1);
    
    let updatedSections = sections.map(s => {
      if (s.startIndex > index) {
        return { ...s, startIndex: Math.max(0, s.startIndex - 1) };
      }
      return s;
    });

    updatedSections = updatedSections.filter((s, idx) => {
      if (s.id === 'default') return true;
      return updatedSections.findIndex(sec => sec.startIndex === s.startIndex) === idx;
    });

    setPages(updatedPages);
    setSections(updatedSections);
  };

  const toggleSplitPoint = (index: number) => {
    if (index === 0) return;

    const existingSectionIndex = sections.findIndex(s => s.startIndex === index);
    if (existingSectionIndex !== -1) {
      const updatedSections = sections.filter(s => s.startIndex !== index);
      const reindexed = updatedSections.map((s, idx) => ({
        ...s,
        name: s.id === 'default' ? 'Bagian 1' : `Bagian ${idx + 1}`
      }));
      setSections(reindexed);
      showStatus('Batas bagian dihapus.', 'info');
    } else {
      const newSection: Section = {
        id: generateId(),
        name: `Bagian ${sections.length + 1}`,
        startIndex: index
      };
      const updatedSections = [...sections, newSection].sort((a, b) => a.startIndex - b.startIndex);
      const reindexed = updatedSections.map((s, idx) => ({
        ...s,
        name: idx === 0 ? 'Bagian 1' : `Bagian ${idx + 1}`
      }));
      setSections(reindexed);
      showStatus(`Bagian baru dibuat dimulai dari halaman ${index + 1}!`, 'success');
    }
  };

  const applyCustomSplitRange = () => {
    const start = parseInt(splitRangeStart, 10);
    const end = parseInt(splitRangeEnd, 10);

    if (isNaN(start) || isNaN(end)) {
      showStatus('Masukkan nomor halaman mulai dan selesai yang valid.', 'error');
      return;
    }

    if (start < 1 || end > pages.length || start > end) {
      showStatus(`Rentang tidak valid. Halaman harus antara 1 sampai ${pages.length}.`, 'error');
      return;
    }

    const updatedSections = [...sections];

    const addPoint = (pageNumber: number) => {
      const idx = pageNumber - 1;
      if (idx > 0 && idx < pages.length && !updatedSections.some(s => s.startIndex === idx)) {
        updatedSections.push({
          id: generateId(),
          name: `Bagian ${updatedSections.length + 1}`,
          startIndex: idx
        });
      }
    };

    addPoint(start);
    addPoint(end + 1);

    const sorted = updatedSections.sort((a, b) => a.startIndex - b.startIndex);
    const reindexed = sorted.map((s, idx) => ({
      ...s,
      name: idx === 0 ? 'Bagian 1' : `Bagian ${idx + 1}`
    }));

    setSections(reindexed);
    setSplitRangeStart('');
    setSplitRangeEnd('');
    showStatus(`Berhasil memotong bagian untuk rentang halaman ${start} - ${end}!`, 'success');
  };

  const rotateSection = (sectionStartIndex: number, sectionEndIndex: number) => {
    const updatedPages = [...pages];
    for (let i = sectionStartIndex; i < sectionEndIndex; i++) {
      updatedPages[i] = {
        ...updatedPages[i],
        rotation: (updatedPages[i].rotation + 90) % 360
      };
    }
    setPages(updatedPages);
    showStatus('Semua halaman dalam bagian berhasil diputar.', 'success');
  };

  const deleteSection = (sectionId: string, sectionStartIndex: number, sectionEndIndex: number) => {
    const updatedPages = [...pages];
    const count = sectionEndIndex - sectionStartIndex;
    updatedPages.splice(sectionStartIndex, count);
    
    let updatedSections = sections.filter(s => s.id !== sectionId);
    updatedSections = updatedSections.map(s => {
      if (s.startIndex > sectionStartIndex) {
        return { ...s, startIndex: Math.max(0, s.startIndex - count) };
      }
      return s;
    });

    if (updatedSections.length === 0 || !updatedSections.some(s => s.startIndex === 0)) {
      const lowest = updatedSections.sort((a, b) => a.startIndex - b.startIndex)[0];
      if (lowest) {
        lowest.id = 'default';
        lowest.startIndex = 0;
      } else {
        updatedSections = [{ id: 'default', name: 'Bagian 1', startIndex: 0 }];
      }
    }

    const reindexed = updatedSections.sort((a, b) => a.startIndex - b.startIndex).map((s, idx) => ({
      ...s,
      name: idx === 0 ? 'Bagian 1' : `Bagian ${idx + 1}`
    }));

    setPages(updatedPages);
    setSections(reindexed);
    showStatus('Seluruh bagian berhasil dihapus.', 'info');
  };

  const renameSection = (id: string, newName: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, name: newName } : s));
  };

  const clearAll = () => {
    setFiles([]);
    setPages([]);
    setSections([{ id: 'default', name: 'Bagian 1', startIndex: 0 }]);
    setPreviewPage(null);
    showStatus('Semua halaman dan berkas telah dibersihkan.', 'info');
  };

  const generateSectionPDF = async (pageList: PDFPageItem[]) => {
    const doc = await PDFDocument.create();
    const pdfLibDocsCache: Record<string, PDFDocument> = {};

    for (const pageItem of pageList) {
      const sourceFile = files.find(f => f.id === pageItem.fileId);
      if (!sourceFile) throw new Error(`File source missing.`);

      if (!pdfLibDocsCache[pageItem.fileId]) {
        pdfLibDocsCache[pageItem.fileId] = await PDFDocument.load(sourceFile.arrayBuffer.slice(0));
      }
      const srcDoc = pdfLibDocsCache[pageItem.fileId];
      const [copiedPage] = await doc.copyPages(srcDoc, [pageItem.originalPageNumber]);

      if (pageItem.rotation !== 0) {
        const currentRotation = copiedPage.getRotation().angle;
        copiedPage.setRotation(degrees((currentRotation + pageItem.rotation) % 360));
      }
      doc.addPage(copiedPage);
    }
    return await doc.save();
  };

  const exportPDFs = async (mode: 'merge-all' | 'zip-sections' | string) => {
    if (pages.length === 0) {
      showStatus('Tidak ada halaman untuk diekspor!', 'error');
      return;
    }

    setIsLoading(true);
    showStatus('Sedang memproses ekspor berkas PDF...', 'info');

    const sortedSections = [...sections].sort((a, b) => a.startIndex - b.startIndex);

    const sectionBundles: { section: Section; pages: PDFPageItem[] }[] = [];
    for (let i = 0; i < sortedSections.length; i++) {
      const current = sortedSections[i];
      const next = sortedSections[i + 1];
      const sectionPages = pages.slice(current.startIndex, next ? next.startIndex : pages.length);
      
      if (sectionPages.length > 0) {
        sectionBundles.push({ section: current, pages: sectionPages });
      }
    }

    try {
      if (mode === 'merge-all' || sectionBundles.length === 1) {
        const pdfBytes = await generateSectionPDF(pages);
        const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'merged_document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showStatus('PDF berhasil digabungkan dan diunduh!', 'success');
      } 
      else if (mode === 'zip-sections') {
        const { default: JSZip } = await import('jszip');
        const zip = new JSZip();

        for (const bundle of sectionBundles) {
          const pdfBytes = await generateSectionPDF(bundle.pages);
          const sanitizedFilename = bundle.section.name.replace(/[^a-z0-9_-]/gi, '_') + '.pdf';
          zip.file(sanitizedFilename, pdfBytes);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'pdf_sections_split.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showStatus('ZIP berisi semua bagian berhasil diunduh!', 'success');
      } 
      else {
        const targetBundle = sectionBundles.find(b => b.section.id === mode);
        if (!targetBundle) throw new Error('Bagian tidak ditemukan');

        const pdfBytes = await generateSectionPDF(targetBundle.pages);
        const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${targetBundle.section.name.replace(/[^a-z0-9_-]/gi, '_')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showStatus(`Bagian "${targetBundle.section.name}" berhasil diunduh!`, 'success');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      showStatus('Gagal mengekspor berkas PDF.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const getSectionGroups = () => {
    const validSections = sections.filter(s => s.startIndex < pages.length || s.id === 'default');
    const sorted = [...validSections].sort((a, b) => a.startIndex - b.startIndex);
    
    return sorted.map((sec, idx) => {
      const nextSec = sorted[idx + 1];
      const startIndex = sec.startIndex;
      const endIndex = nextSec ? nextSec.startIndex : pages.length;
      const sectionPages = pages.slice(startIndex, endIndex).map((page, localIdx) => ({
        page,
        globalIndex: startIndex + localIdx
      }));

      return {
        section: sec,
        pages: sectionPages,
        startIndex,
        endIndex,
        nextSectionStartIndex: nextSec ? nextSec.startIndex : null
      };
    });
  };

  const sectionGroups = getSectionGroups();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <div className="bg-red-500 text-white p-2.5 rounded-lg shadow-sm">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 m-0">Urbays PDF Editor & Splitter</h1>
              <p className="text-xs text-slate-500 m-0">Atur ulang, rotasi, hapus, pisahkan section & gabung PDF secara visual</p>
            </div>
          </div>
          
          {/* Navigation Menu Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Editor & Merger
            </button>
            <button
              onClick={() => setActiveTab('split')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'split'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Split Section
            </button>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-950 text-white hover:bg-slate-800 rounded-lg text-sm font-semibold transition cursor-pointer shadow-xs"
              disabled={isLoading}
            >
              <FilePlus className="h-4 w-4" />
              <span>Tambah PDF</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept=".pdf"
              className="hidden"
            />
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-6">
        <StatusToast statusMessage={statusMessage} />
        <LoadingOverlay isLoading={isLoading} />

        {/* Empty State */}
        {pages.length === 0 ? (
          <EmptyState onUploadClick={() => fileInputRef.current?.click()} />
        ) : (
          /* Render Active Page Tab */
          activeTab === 'editor' ? (
            <EditorPage
              files={files}
              pages={pages}
              draggedIndex={draggedIndex}
              dragOverIndex={dragOverIndex}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              setDraggedIndex={setDraggedIndex}
              setDragOverIndex={setDragOverIndex}
              setPreviewPage={setPreviewPage}
              rotatePage={rotatePage}
              deletePage={deletePage}
              movePage={movePage}
              exportPDFs={exportPDFs}
              clearAll={clearAll}
              formatBytes={(b) => formatBytes(b)}
            />
          ) : (
            <SplitPage
              files={files}
              pages={pages}
              sections={sections}
              sectionGroups={sectionGroups}
              draggedIndex={draggedIndex}
              dragOverIndex={dragOverIndex}
              splitRangeStart={splitRangeStart}
              splitRangeEnd={splitRangeEnd}
              setSplitRangeStart={setSplitRangeStart}
              setSplitRangeEnd={setSplitRangeEnd}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              setDraggedIndex={setDraggedIndex}
              setDragOverIndex={setDragOverIndex}
              setPreviewPage={setPreviewPage}
              rotatePage={rotatePage}
              deletePage={deletePage}
              movePage={movePage}
              toggleSplitPoint={toggleSplitPoint}
              renameSection={renameSection}
              rotateSection={rotateSection}
              deleteSection={deleteSection}
              applyCustomSplitRange={applyCustomSplitRange}
              exportPDFs={exportPDFs}
              clearAll={clearAll}
              formatBytes={(b) => formatBytes(b)}
            />
          )
        )}
      </main>

      {/* Preview Modal */}
      <PreviewModal
        previewPage={previewPage}
        onClose={() => setPreviewPage(null)}
        onRotate={() => {
          const targetIdx = pages.findIndex(p => p.id === previewPage?.id);
          if (targetIdx !== -1) {
            rotatePage(targetIdx);
            setPreviewPage(prev => prev ? { ...prev, rotation: (prev.rotation + 90) % 360 } : null);
          }
        }}
        onDelete={() => {
          const targetIdx = pages.findIndex(p => p.id === previewPage?.id);
          if (targetIdx !== -1) {
            deletePage(targetIdx);
            setPreviewPage(null);
          }
        }}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-slate-400 font-medium">
          Dibuat oleh Urbays 2026 • Semua pemrosesan data dilakukan secara lokal di peramban Anda secara aman.
        </div>
      </footer>
    </div>
  );
}
