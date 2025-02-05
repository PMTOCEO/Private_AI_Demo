import React from 'react';
import { getFileTypeInfo } from '../utils/fileUtils';
import type { FileItem, FileType } from '../types/file';

interface FilePreviewState {
  pendingPreviewUrl: string | null;
  pendingFileChanges: Partial<FileItem>;
  isProcessing: boolean;
  fileType: FileType | null;
}

interface FilePreviewActions {
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  resetPreview: () => void;
  updatePreview: (file: File) => Promise<void>;
}

export function useFilePreview(initialFileType: FileType | null = null): [FilePreviewState, FilePreviewActions] {
  const [pendingPreviewUrl, setPendingPreviewUrl] = React.useState<string | null>(null);
  const [pendingFileChanges, setPendingFileChanges] = React.useState<Partial<FileItem>>({});
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [fileType, setFileType] = React.useState<FileType | null>(initialFileType);

  const processFile = async (file: File): Promise<{ dataUrl: string; fileType: FileType }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const fileType = getFileTypeInfo(file);

      reader.onload = () => {
        resolve({
          dataUrl: reader.result as string,
          fileType
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const updatePreview = async (file: File) => {
    setIsProcessing(true);
    try {
      const { dataUrl, fileType } = await processFile(file);
      setPendingPreviewUrl(dataUrl);
      setFileType(fileType);
      setPendingFileChanges({
        fileType,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        dataUrl,
        lastModified: new Date().toLocaleString()
      });
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await updatePreview(file);
    }
  };

  const resetPreview = () => {
    setPendingPreviewUrl(null);
    setPendingFileChanges({});
    setIsProcessing(false);
    setFileType(initialFileType);
  };

  return [
    { pendingPreviewUrl, pendingFileChanges, isProcessing, fileType },
    { handleFileSelect, resetPreview, updatePreview }
  ];
}