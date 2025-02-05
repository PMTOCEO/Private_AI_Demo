import React from 'react';
import { FileText, Upload } from 'lucide-react';
import type { FileItem } from '../../types/file';
import { FileUploadBox } from './FileUploadBox';

interface FilePreviewProps {
  file: File | FileItem;
  previewUrl: string | null;
  isProcessing?: boolean;
  onReplace: () => void;
}

export function FilePreview({
  file,
  previewUrl,
  isProcessing,
  onReplace
}: FilePreviewProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  // Type guard to check if file is FileItem or File
  const isFileItem = (file: File | FileItem): file is FileItem => {
    return 'fileType' in file;
  };

  const isImage = isFileItem(file) 
    ? file.fileType?.mimeType.startsWith('image/') 
    : file.type.startsWith('image/');
    
  const fileName = isFileItem(file) ? file.name : file.name;

  if (!previewUrl) {
    return <FileUploadBox onClick={onReplace} />;
  }

  return (
    <div
      className="relative h-48 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onReplace}
    >
      {isImage ? (
        <img
          src={previewUrl}
          alt={fileName}
          className={`w-full h-full object-contain ${isProcessing ? 'opacity-75' : ''}`}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <FileText size={48} className="text-gray-400 dark:text-gray-500" />
          <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {fileName}
          </span>
        </div>
      )}
      
      {(isHovered || isProcessing) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200">
          <div className="flex flex-col items-center space-y-2 text-white">
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                <span className="text-sm">Processing...</span>
              </>
            ) : (
              <>
                <Upload size={24} />
                <span className="text-sm">Replace {isImage ? 'Image' : 'File'}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}