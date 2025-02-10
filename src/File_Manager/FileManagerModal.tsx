import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { FilesProvider } from './context/FilesContext.tsx';
import { SearchProvider } from './context/SearchContext.tsx';
import { FilesSidebar } from './components/FilesSidebar.tsx';
import { FilesMainContent } from './components/FilesMainContent.tsx';
import { useFiles } from './hooks/useFiles';
import { useAuth } from '../Authentication/context/AuthContext';
import type { FileItem } from './types/file.ts';

interface FileManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

function FileManagerContent() {
  const { getFiles, uploadFile, updateFile, deleteFile } = useFiles();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    const loadFiles = async () => {
      if (!isAuthenticated) {
        setFiles([]);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const userFiles = await getFiles();
        setFiles(userFiles || []);
      } catch (error) {
        console.error('Error loading files:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFiles();
  }, [getFiles, isAuthenticated]);

  const handleFileUpload = async (file: File, description?: string): Promise<void> => {
    try {
      const newFile = await uploadFile(file, description);
      setFiles(prev => [newFile, ...prev]);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleFileUpdate = async (fileId: string, updates: Partial<FileItem>) => {
    try {
      await updateFile(fileId, updates);
      setFiles(prev => prev.map(file => 
        file.id === fileId ? { ...file, ...updates } : file
      ));
    } catch (error) {
      console.error('Error updating file:', error);
      throw error;
    }
  };

  const handleFileDelete = async (fileId: string, storagePath: string) => {
    try {
      await deleteFile(fileId, storagePath);
      setFiles(prev => prev.filter(file => file.id !== fileId));
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  };
  
  if (authLoading || isLoading) {
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
    <FilesProvider>
      <SearchProvider files={files}>
        <div className="flex h-full w-full">
          <FilesSidebar onFileUpload={handleFileUpload} />
          <FilesMainContent 
            files={files}
            onFileUpdate={handleFileUpdate}
            onFileDelete={handleFileDelete}
          />
        </div>
      </SearchProvider>
    </FilesProvider>
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

        <FileManagerContent />
      </div>
    </div>
  );
}