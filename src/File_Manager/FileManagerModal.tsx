import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { FilesProvider } from './context/FilesContext.tsx';
import { SearchProvider } from './context/SearchContext.tsx';
import { FilesSidebar } from './components/FilesSidebar.tsx';
import { FilesMainContent } from './components/FilesMainContent.tsx';
import { useFiles } from './hooks/useFiles.ts';
import { useAuth } from '../Authentication/context/AuthContext';
import type { FileItem } from './types/file.ts';

interface FileManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

function FileManagerContent() {
  const { getFiles } = useFiles();
  const [files, setFiles] = useState<FileItem[]>([]);
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const loadFiles = async () => {
      if (!isAuthenticated) return;
      const userFiles = await getFiles();
      setFiles(userFiles || []);
    };

    loadFiles();
  }, [getFiles, isAuthenticated]);
  
  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex w-full items-center justify-center">
        <p className="text-lg text-gray-500">Please sign in to access files</p>
      </div>
    );
  }

  return (
    <SearchProvider files={files}>
      <div className="flex h-full w-full">
        <FilesSidebar />
        <FilesMainContent />
      </div>
    </SearchProvider>
  );
}

export function FileManagerModal({ isOpen, onClose, isDarkMode }: FileManagerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className={`relative flex h-[80vh] w-full max-w-[1400px] overflow-hidden rounded-xl shadow-2xl ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <button
          onClick={onClose}
          className={`absolute right-4 top-4 z-[60] rounded-full p-2 transition-colors duration-200 ${
            isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          }`}
        >
          <X className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        </button>

        <FilesProvider>
          <FileManagerContent />
        </FilesProvider>
      </div>
    </div>
  );
}