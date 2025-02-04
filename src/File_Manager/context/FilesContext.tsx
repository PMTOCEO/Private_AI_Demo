import React, { createContext, useContext, useReducer } from 'react';
import type { FileItem, FileState } from '../types/file';

type FileAction = 
  | { type: 'ADD_FILE'; payload: FileItem }
  | { type: 'ADD_FOLDER'; payload: FileItem }
  | { type: 'DELETE_FILE'; payload: string }
  | { type: 'TOGGLE_SHARE'; payload: string }
  | { type: 'UPDATE_FILE'; payload: { id: string; updates: Partial<FileItem> } }
  | { type: 'REORDER_FILES'; payload: { fileId: string; newIndex: number } }
  | { type: 'MOVE_FILE'; payload: { fileId: string; destinationFolderId: string | null } }
  | { type: 'SET_CURRENT_FOLDER'; payload: string | null };

const initialState: FileState = {
  files: [],
  recentFiles: [],
  currentFolder: null
};

function fileReducer(state: FileState, action: FileAction): FileState {
  switch (action.type) {
    case 'ADD_FILE':
    case 'ADD_FOLDER':
      const now = new Date().toLocaleString();
      return {
        ...state,
        files: [...state.files, { 
          ...action.payload, 
          parentId: state.currentFolder,
          createdDate: now,
          lastModified: null
        }],
        recentFiles: [action.payload, ...state.recentFiles.slice(0, 4)]
      };

    case 'UPDATE_FILE':
      return {
        ...state,
        files: state.files.map(file =>
          file.id === action.payload.id
            ? { 
                ...file, 
                ...action.payload.updates,
                lastModified: new Date().toLocaleString()
              }
            : file
        )
      };

    case 'DELETE_FILE':
      return {
        ...state,
        files: state.files.filter(file => 
          file.id !== action.payload && file.parentId !== action.payload
        ),
        recentFiles: state.recentFiles.filter(file => file.id !== action.payload)
      };

    case 'TOGGLE_SHARE':
      return {
        ...state,
        files: state.files.map(file =>
          file.id === action.payload
            ? { ...file, shared: !file.shared }
            : file
        )
      };

    case 'REORDER_FILES': {
      const { fileId, newIndex } = action.payload;
      
      // Get all files in the current folder
      const currentFolderFiles = state.files.filter(
        file => file.parentId === state.currentFolder
      );
      
      // Find the file to move
      const fileToMove = currentFolderFiles.find(f => f.id === fileId);
      if (!fileToMove) return state;
      
      // Get the current index
      const oldIndex = currentFolderFiles.findIndex(f => f.id === fileId);
      
      // Create a new array with the reordered files
      const reorderedFiles = [...currentFolderFiles];
      reorderedFiles.splice(oldIndex, 1);
      reorderedFiles.splice(newIndex, 0, fileToMove);
      
      // Create a map of new positions
      const newPositions = new Map(
        reorderedFiles.map((file, index) => [file.id, index])
      );
      
      // Update all files, maintaining the new order for current folder files
      return {
        ...state,
        files: state.files.map(file => {
          if (file.parentId === state.currentFolder) {
            const position = newPositions.get(file.id);
            if (position !== undefined) {
              return { ...file, order: position };
            }
          }
          return file;
        }).sort((a, b) => {
          if (a.parentId === state.currentFolder && b.parentId === state.currentFolder) {
            return (a.order || 0) - (b.order || 0);
          }
          return 0;
        })
      };
    }

    case 'MOVE_FILE':
      return {
        ...state,
        files: state.files.map(file =>
          file.id === action.payload.fileId
            ? { ...file, parentId: action.payload.destinationFolderId }
            : file
        )
      };

    case 'SET_CURRENT_FOLDER':
      return {
        ...state,
        currentFolder: action.payload
      };

    default:
      return state;
  }
}

const FilesContext = createContext<{
  state: FileState;
  dispatch: React.Dispatch<FileAction>;
} | null>(null);

export function FilesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(fileReducer, initialState);

  return (
    <FilesContext.Provider value={{ state, dispatch }}>
      {children}
    </FilesContext.Provider>
  );
}

export function useFiles() {
  const context = useContext(FilesContext);
  if (!context) {
    throw new Error('useFiles must be used within a FilesProvider');
  }
  return context;
}