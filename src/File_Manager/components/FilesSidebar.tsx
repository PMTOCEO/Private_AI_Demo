import React from 'react';
import { Upload, FilePlus, FolderPlus } from 'lucide-react';
import { NewFileModal } from './NewFileModal';
import { NewFolderModal } from './NewFolderModal';

interface FilesSidebarProps {
  onFileUpload: (file: File, description?: string) => Promise<void>;
}

export function FilesSidebar({ onFileUpload }: FilesSidebarProps) {
  const [showNewFileModal, setShowNewFileModal] = React.useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = React.useState(false);

  const handleFileUpload = async (file: File, description?: string) => {
    try {
      await onFileUpload(file, description);
      setShowNewFileModal(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle error (show notification, etc.)
    }
  };

  return (
    <div className="w-[240px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-8 pt-10 flex flex-col border-r border-gray-200 dark:border-gray-800">
      <div className="pt-4">
        <h1 className="text-xl font-semibold mb-6">File Manager</h1>
        
        <nav className="space-y-4">
          <div>
            <button 
              onClick={() => setShowNewFileModal(true)}
              className="flex items-center space-x-3 w-full px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
            >
              <Upload className="w-5 h-5" />
              <span>Upload</span>
            </button>
          </div>

          <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
            <button 
              onClick={() => setShowNewFileModal(true)}
              className="flex items-center space-x-3 w-full px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
            >
              <FilePlus className="w-5 h-5" />
              <span>New File</span>
            </button>
          </div>

          <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
            <button 
              onClick={() => setShowNewFolderModal(true)}
              className="flex items-center space-x-3 w-full px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
            >
              <FolderPlus className="w-5 h-5" />
              <span>New Folder</span>
            </button>
          </div>
        </nav>
      </div>

      {showNewFileModal && (
        <NewFileModal 
          onClose={() => setShowNewFileModal(false)} 
          onUpload={handleFileUpload}
        />
      )}

      {showNewFolderModal && (
        <NewFolderModal onClose={() => setShowNewFolderModal(false)} />
      )}
    </div>
  );
}