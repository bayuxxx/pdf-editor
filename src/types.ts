export interface PDFPageItem {
  id: string;
  fileId: string;
  fileName: string;
  originalPageNumber: number;
  rotation: number;
  thumbnailUrl: string;
  width: number;
  height: number;
}

export interface LoadedFile {
  id: string;
  name: string;
  size: number;
  pageCount: number;
  arrayBuffer: ArrayBuffer;
}

export interface Section {
  id: string;
  name: string;
  startIndex: number;
}

export interface SectionGroup {
  section: Section;
  pages: { page: PDFPageItem; globalIndex: number }[];
  startIndex: number;
  endIndex: number;
  nextSectionStartIndex: number | null;
}
