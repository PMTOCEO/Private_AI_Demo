import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useFiles } from '../context/FilesContext';
import type { FileItem } from '../types/file';

export function FolderNavigation() {
  const { state, dispatch } = useFiles();
  const [breadcrumbs, setBreadcrumbs] = React.useState<FileItem[]>([]);

  React.useEffect(() => {
    const buildBreadcrumbs = () => {
      const crumbs: FileItem[] = [];
      let currentFolderId = state.currentFolder;
      
      while (currentFolderId) {
        const folder = state.files.find(f => f.id === currentFolderId);
        if (folder) {
          crumbs.unshift(folder);
          currentFolderId = folder.parentId || null;
        } else {
          break;
        }
      }
      
      setBreadcrumbs(crumbs);
    };

    buildBreadcrumbs();
  }, [state.currentFolder, state.files]);

  const handleNavigateUp = () => {
    if (breadcrumbs.length > 0) {
      const parentFolder = breadcrumbs[breadcrumbs.length - 2];
      dispatch({ type: 'SET_CURRENT_FOLDER', payload: parentFolder?.id || null });
    } else {
      dispatch({ type: 'SET_CURRENT_FOLDER', payload: null });
    }
  };

  const handleNavigateHome = () => {
    dispatch({ type: 'SET_CURRENT_FOLDER', payload: null });
  };

  const handleBreadcrumbClick = (folderId: string) => {
    dispatch({ type: 'SET_CURRENT_FOLDER', payload: folderId });
  };

  if (!state.currentFolder) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="px-6 py-3 flex items-center space-x-4">
        <button
          onClick={handleNavigateUp}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 
            hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
          aria-label="Go back"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleNavigateHome}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Home
          </button>
          
          {breadcrumbs.map((folder, index) => (
            <React.Fragment key={folder.id}>
              <span className="text-gray-400 dark:text-gray-600">/</span>
              <button
                onClick={() => handleBreadcrumbClick(folder.id)}
                className={`text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white
                  ${index === breadcrumbs.length - 1 ? 'font-semibold' : ''}`}
              >
                {folder.name}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}