import React from 'react';
import { FileText, Image as ImageIcon } from 'lucide-react';
import type { FileItem } from '../../types/file';

interface FilePreviewProps {
  file: FileItem;
  previewUrl: string | null;
  onReplace: () => void;
  isPending?: boolean;
}

export function FilePreview({
  file,
  previewUrl,
  onReplace,
  isPending
}: FilePreviewProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const isImage = file.fileType?.mimeType.startsWith('image/');

  if (!previewUrl) {
    return (
      <div
        onClick={onReplace}
        className="w-full h-48 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 
          text-gray-700 dark:text-gray-300 rounded-lg border-2 border-dashed border-gray-300 
          dark:border-gray-700 cursor-pointer hover:border-gray-400 dark:hover:border-gray-600"
      >
        <ImageIcon size={24} />
        <span className="mt-2 text-sm">Click to upload</span>
      </div>
    );
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
          alt={file.name}
          className={`w-full h-full object-contain ${isPending ? 'opacity-75' : ''}`}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <FileText size={48} className="text-gray-400 dark:text-gray-500" />
          <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {file.name}
          </span>
        </div>
      )}
      
      {(isHovered || isPending) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200">
          <div className="flex flex-col items-center space-y-2 text-white">
            {isPending ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                <span className="text-sm">Processing...</span>
              </>
            ) : (
              <>
                <ImageIcon size={24} />
                <span className="text-sm">Replace {isImage ? 'Image' : 'File'}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}