export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isNew?: boolean; // Add this field to track new messages
}

export interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  messages?: Message[];
  timestamp: number;
  createdAt: number;
  expiresAt: number;
  tags?: string[];
  isPinned: boolean;
}

export interface EncryptedData {
  data: string;
  iv: string;
}

export interface FileType {
  mimeType: string;
  extension: string;
  displayName: string;
}

export interface FileItem {
  id: string;
  name: string;
  description?: string;
  size: string;
  type: 'file' | 'folder';
  fileType?: FileType;
  dataUrl?: string;
  createdDate: string;
  lastModified: string | null;
  permissions: string;
  owner: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
}