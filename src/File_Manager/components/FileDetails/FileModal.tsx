import React from 'react';
import { X } from 'lucide-react';
import type { FileItem } from '../../types/file';
import { useFiles } from '../../context/FilesContext';
import { FilePreview } from './FilePreview';
import { FileMetadata } from './FileMetadata';
import { FileActions } from './FileActions';
import { getFileTypeInfo } from '../../utils/fileUtils';

interface FileModalProps {
  file: FileItem;
  onClose: () => void;
}

export function FileModal({ file, onClose }: FileModalProps) {
  const { dispatch } = useFiles();
  const [fileName, setFileName] = React.useState(file.name);
  const [description, setDescription] = React.useState(file.description || '');
  const [hasChanges, setHasChanges] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    // Create preview URL for image files
    if (file.fileType?.mimeType.startsWith('image/') && file.dataUrl) {
      setPreviewUrl(file.dataUrl);
    }
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [file]);

  const handleShare = () => {
    dispatch({ type: 'TOGGLE_SHARE', payload: file.id });
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_FILE', payload: file.id });
    onClose();
  };

  const handleDownload = () => {
    if (file.dataUrl) {
      const link = document.createElement('a');
      link.href = file.dataUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReplace = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files?.[0];
    if (!newFile) return;

    const fileType = getFileTypeInfo(newFile);
    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = reader.result as string;
      const updates = {
        name: newFile.name,
        size: `${(newFile.size / 1024).toFixed(2)} KB`,
        fileType,
        dataUrl,
        lastModified: new Date().toLocaleString()
      };

      dispatch({
        type: 'UPDATE_FILE',
        payload: { id: file.id, updates }
      });

      setFileName(newFile.name);
      if (fileType.mimeType.startsWith('image/')) {
        setPreviewUrl(dataUrl);
      }
      setHasChanges(false);
    };

    reader.readAsDataURL(newFile);
  };

  const handleInputChange = (field: 'name' | 'description', value: string) => {
    if (field === 'name') {
      setFileName(value);
    } else {
      setDescription(value);
    }
    setHasChanges(true);
  };

  const handleSave = () => {
    if (hasChanges) {
      dispatch({ 
        type: 'UPDATE_FILE', 
        payload: { 
          id: file.id, 
          updates: {
            name: fileName,
            description,
            lastModified: new Date().toLocaleString()
          }
        }
      });
      setHasChanges(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-[600px] shadow-xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">File Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept={file.fileType?.mimeType.startsWith('image/') ? "image/*" : undefined}
          />

          <FilePreview
            file={file}
            previewUrl={previewUrl}
            onReplace={handleReplace}
            isPending={false}
          />

          <FileMetadata
            file={file}
            fileName={fileName}
            description={description}
            onInputChange={handleInputChange}
          />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex justify-between">
          <FileActions
            file={file}
            currentPreviewUrl={previewUrl}
            pendingPreviewUrl={null}
            fileName={fileName}
            onShare={handleShare}
            onDelete={handleDelete}
            onDownload={handleDownload}
          />
          
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              hasChanges
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}