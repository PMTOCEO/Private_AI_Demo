import React from 'react';
import { X } from 'lucide-react';
import { useFiles } from '../context/FilesContext';

interface NewFolderModalProps {
  onClose: () => void;
}

export function NewFolderModal({ onClose }: NewFolderModalProps) {
  const { dispatch } = useFiles();
  const [folderName, setFolderName] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName) {
      const newFolder = {
        id: crypto.randomUUID(),
        name: folderName,
        size: '--',
        permissions: 'Read/Write',
        createdDate: new Date().toLocaleString(),
        lastModified: null,
        owner: 'You',
        type: 'folder' as const,
        storagePath: ''
      };
      dispatch({ type: 'ADD_FOLDER', payload: newFolder });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-[500px] shadow-xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">New Folder</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Folder Name
            </label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2
                focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600
                text-gray-900 dark:text-white bg-white dark:bg-gray-800"
              placeholder="Enter folder name"
              autoFocus
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 
                dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 
                rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}