import React from 'react';
import { X } from 'lucide-react';
import { useFiles } from '../context/FilesContext';
import { useFileUpload } from '../hooks/useFileUpload';
import { FilePreview } from './shared/FilePreview';
import { FileForm } from './NewFile/FileForm';
import type { FileItem } from '../types/file';

interface NewFileModalProps {
  onClose: () => void;
  onUpload: (file: File, description?: string) => Promise<void>;
}

export function NewFileModal({ onClose, onUpload }: NewFileModalProps) {
  const { state } = useFiles();
  const [fileName, setFileName] = React.useState('');
  const [description, setDescription] = React.useState('');

  const [
    { selectedFile, previewUrl, fileType, isProcessing },
    { handleFileSelect, fileInputRef }
  ] = useFileUpload();

  React.useEffect(() => {
    if (selectedFile && !fileName) {
      setFileName(selectedFile.name);
    }
  }, [selectedFile]);

  const handleSave = async () => {
    if (!fileName.trim() || !selectedFile) return;

    try {
      await onUpload(selectedFile, description);
      onClose();
    } catch (error) {
      console.error('Error saving file:', error);
      // TODO: Add error notification
    }
  };

  // Create a placeholder FileItem when no file is selected
  const placeholderFile: FileItem = {
    id: 'placeholder',
    name: 'No file selected',
    size: '0 KB',
    permissions: 'Read/Write',
    createdDate: new Date().toLocaleString(),
    lastModified: null,
    owner: 'You',
    type: 'file',
    fileType: {
      mimeType: 'text/plain',
      extension: 'txt',
      displayName: 'Text File'
    },
    storagePath: ''
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-[500px] shadow-xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">New File</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Upload File
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />
            <FilePreview
              file={selectedFile || placeholderFile}
              previewUrl={previewUrl}
              isProcessing={isProcessing}
              onReplace={() => fileInputRef.current?.click()}
            />
          </div>

          <FileForm
            fileName={fileName}
            description={description}
            fileType={fileType}
            onFileNameChange={setFileName}
            onDescriptionChange={setDescription}
          />
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
            onClick={handleSave}
            disabled={!fileName.trim() || !selectedFile}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              fileName.trim() && selectedFile
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}