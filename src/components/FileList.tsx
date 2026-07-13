import React from 'react';
import { FileText } from 'lucide-react';
import type { LoadedFile } from '../types';

interface FileListProps {
  files: LoadedFile[];
  formatBytes: (bytes: number) => string;
}

export const FileList: React.FC<FileListProps> = ({ files, formatBytes }) => {
  return (
    <div>
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Dokumen Sumber</h3>
      <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
        {files.map(file => (
          <div key={file.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start space-x-3">
            <FileText className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 truncate" title={file.name}>
                {file.name}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                {file.pageCount} Halaman • {formatBytes(file.size)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
