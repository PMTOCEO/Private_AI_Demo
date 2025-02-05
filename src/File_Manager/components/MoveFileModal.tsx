import React from 'react';
import { X, Home, Folder } from 'lucide-react';
import { useFiles } from '../context/FilesContext';
import type { FileItem } from '../types/file';

interface MoveFileModalProps {
  file: FileItem;
  onClose: () => void;
}

export function MoveFileModal({ file, onClose }: MoveFileModalProps) {
  const { state, dispatch } = useFiles();
  const [selectedDestination, setSelectedDestination] = React.useState<string | null>(null);

  // Get all folders except the current folder and its children
  const availableFolders = state.files.filter(f => 
    f.type === 'folder' && 
    f.id !== file.parentId &&
    f.parentId !== file.id
  );

  const handleMove = () => {
    dispatch({
      type: 'MOVE_FILE',
      payload: {
        fileId: file.id,
        destinationFolderId: selectedDestination
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-[400px] shadow-xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Move File</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="space-y-2">
            <button
              onClick={() => setSelectedDestination(null)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200
                ${selectedDestination === null
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
            >
              <Home size={20} />
              <span>Home</span>
            </button>

            {availableFolders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setSelectedDestination(folder.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200
                  ${selectedDestination === folder.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
              >
                <Folder size={20} />
                <span>{folder.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 
              dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleMove}
            className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 
              rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200"
          >
            Move
          </button>
        </div>
      </div>
    </div>
  );
}