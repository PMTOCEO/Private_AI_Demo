import { FileType } from '../types/file';

export function getFileTypeInfo(file: File): FileType {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const mimeType = file.type || 'application/octet-stream';

  // Common file type mappings
  const fileTypes: Record<string, string> = {
    // Images
    'image/jpeg': 'JPEG Image',
    'image/png': 'PNG Image',
    'image/gif': 'GIF Image',
    'image/svg+xml': 'SVG Image',
    // Documents
    'application/pdf': 'PDF Document',
    'application/msword': 'Word Document',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
    // Text
    'text/plain': 'Text File',
    'text/html': 'HTML File',
    'text/css': 'CSS File',
    'text/javascript': 'JavaScript File',
    // Archives
    'application/zip': 'ZIP Archive',
    'application/x-rar-compressed': 'RAR Archive',
    // Default
    'application/octet-stream': 'Binary File'
  };

  return {
    mimeType,
    extension,
    displayName: fileTypes[mimeType] || `${extension.toUpperCase()} File`
  };
}