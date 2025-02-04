import React from 'react';
import { getFileTypeInfo } from '../utils/fileUtils';
import type { FileType } from '../types/file';

interface FileUploadState {
  selectedFile: File | null;
  previewUrl: string | null;
  fileType: FileType | null;
  isProcessing: boolean;
}

interface FileUploadActions {
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  resetUpload: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  updateFileData: (file: File, dataUrl: string) => void;
}

export function useFileUpload(): [FileUploadState, FileUploadActions] {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [fileType, setFileType] = React.useState<FileType | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    try {
      const { dataUrl, fileType } = await processFile(file);
      updateFileData(file, dataUrl);
      setFileType(fileType);
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const updateFileData = (file: File, dataUrl: string) => {
    setSelectedFile(file);
    setPreviewUrl(dataUrl);
    setFileType(getFileTypeInfo(file));
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileType(null);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return [
    { selectedFile, previewUrl, fileType, isProcessing },
    { handleFileSelect, resetUpload, fileInputRef, updateFileData }
  ];
}