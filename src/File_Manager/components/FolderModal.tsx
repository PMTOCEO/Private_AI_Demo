import React from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { FileItem } from '../types/file';
import { useFiles } from '../context/FilesContext';
import { FilesTable } from './FilesTable';

interface FolderModalProps {
  folder: FileItem;
  onClose: () => void;
}

export function FolderModal({ folder, onClose }: FolderModalProps) {
  const { state, dispatch } = useFiles();
  const [breadcrumbs, setBreadcrumbs] = React.useState<FileItem[]>([]);

  React.useEffect(() => {
    const buildBreadcrumbs = () => {
      const crumbs: FileItem[] = [];
      let currentFolder = folder;
      
      while (currentFolder.parentId) {
        const parent = state.files.find(f => f.id === currentFolder.parentId);
        if (parent) {
          crumbs.unshift(parent);
          currentFolder = parent;
        } else {
          break;
        }
      }
      
      setBreadcrumbs([...crumbs, folder]);
    };

    buildBreadcrumbs();
  }, [folder, state.files]);

  const handleNavigateUp = () => {
    if (folder.parentId) {
      const parentFolder = state.files.find(f => f.id === folder.parentId);
      if (parentFolder) {
        dispatch({ type: 'SET_CURRENT_FOLDER', payload: parentFolder.id });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[900px] h-[600px] shadow-xl flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center space-x-4">
            {folder.parentId && (
              <button
                onClick={handleNavigateUp}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div className="flex items-center space-x-2">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.id}>
                  {index > 0 && <span className="text-gray-400">/</span>}
                  <button
                    onClick={() => dispatch({ type: 'SET_CURRENT_FOLDER', payload: crumb.id })}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {crumb.name}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <FilesTable type="my-files" />
        </div>
      </div>
    </div>
  );
}