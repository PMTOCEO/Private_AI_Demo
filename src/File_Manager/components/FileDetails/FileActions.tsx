import React from 'react';
import { Share2, Download, Trash2, FolderUp } from 'lucide-react';
import type { FileItem } from '../../types/file';
import { MoveFileModal } from '../MoveFileModal';

interface FileActionsProps {
  file: FileItem;
  currentPreviewUrl: string | null;
  pendingPreviewUrl: string | null;
  fileName: string;
  onShare: () => void;
  onDelete: () => void;
  onDownload: () => void;
}

export function FileActions({
  file,
  currentPreviewUrl,
  pendingPreviewUrl,
  fileName,
  onShare,
  onDelete,
  onDownload
}: FileActionsProps) {
  const [showMoveModal, setShowMoveModal] = React.useState(false);

  return (
    <>
      <div className="flex space-x-4">
        <button
          onClick={onShare}
          className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 
            hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
        >
          <Share2 size={16} />
          <span>{file.shared ? 'Unshare' : 'Share'}</span>
        </button>

        {(pendingPreviewUrl || currentPreviewUrl) && (
          <button
            onClick={onDownload}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 
              hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
          >
            <Download size={16} />
            <span>Download</span>
          </button>
        )}

        <button
          onClick={() => setShowMoveModal(true)}
          className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 
            hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
        >
          <FolderUp size={16} />
          <span>Move</span>
        </button>

        <button
          onClick={onDelete}
          className="flex items-center space-x-2 px-4 py-2 text-red-600 dark:text-red-400 
            hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-200"
        >
          <Trash2 size={16} />
          <span>Delete</span>
        </button>
      </div>

      {showMoveModal && (
        <MoveFileModal
          file={file}
          onClose={() => setShowMoveModal(false)}
        />
      )}
    </>
  );
}