import { FileText, Image as ImageIcon } from 'lucide-react';

interface FilePreviewProps {
  file: File | null;
  previewUrl: string | null;
  isPending?: boolean;
}

export function FilePreview({ file, previewUrl, isPending }: FilePreviewProps) {
  const isImage = file?.type.startsWith('image/');

  if (!isImage) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex flex-col items-center space-y-2">
          <FileText size={48} className="text-gray-400 dark:text-gray-500" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {file ? file.name : 'No file selected'}
          </span>
        </div>
      </div>
    );
  }

  if (!previewUrl) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex flex-col items-center space-y-2">
          <ImageIcon size={48} className="text-gray-400 dark:text-gray-500" />
          <span className="text-sm text-gray-500 dark:text-gray-400">No preview available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-48 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
      <img
        src={previewUrl}
        alt={file?.name || 'Preview'}
        className={`w-full h-full object-contain ${isPending ? 'opacity-75' : ''}`}
      />
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center space-y-2 text-white">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
            <span className="text-sm">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
}