import React from 'react';
import { FileUploadBox } from '../shared/FileUploadBox';
import { useFileUpload } from '../../hooks/useFileUpload';
import { FilePreview } from '../shared/FilePreview';

interface FileUploadProps {
  onFileSelect: (file: File, previewUrl: string) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [
    { selectedFile, previewUrl, isProcessing },
    { handleFileSelect, fileInputRef }
  ] = useFileUpload();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    await handleFileSelect(event);
    if (selectedFile && previewUrl) {
      onFileSelect(selectedFile, previewUrl);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Upload File
      </label>
      <input
        type="file"
        className="hidden"
        onChange={handleUpload}
        ref={fileInputRef}
      />
      {selectedFile && previewUrl ? (
        <FilePreview
          file={selectedFile}
          previewUrl={previewUrl}
          isProcessing={isProcessing}
          onReplace={() => fileInputRef.current?.click()}
        />
      ) : (
        <FileUploadBox onClick={() => fileInputRef.current?.click()} />
      )}
    </div>
  );
}