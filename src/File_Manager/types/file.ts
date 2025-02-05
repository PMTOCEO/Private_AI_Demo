export interface FileType {
  mimeType: string;
  extension: string;
  displayName: string;
}

export interface FileVersion {
  id: string;
  uploadDate: string;
  size: string;
  note?: string;
}

export interface FileItem {
  id: string;
  name: string;
  size: string;
  permissions: string;
  createdDate: string;
  lastModified: string | null;
  owner: string;
  type: 'file' | 'folder';
  shared?: boolean;
  parentId?: string | null;
  order?: number;
  fileType?: FileType;
  description?: string;
  dataUrl?: string;
  content?: string;
  children?: FileItem[];
}

export interface FileState {
  files: FileItem[];
  recentFiles: FileItem[];
  currentFolder: string | null;
}