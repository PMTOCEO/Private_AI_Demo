import { Folder, FileText } from 'lucide-react';
import type { FileItem } from '../../types/file';

interface DragOverlayProps {
  activeFile: FileItem | undefined;
}

export function DragOverlayContent({ activeFile }: DragOverlayProps) {
  if (!activeFile) return null;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 opacity-90">
      <div className="flex items-center gap-2 text-gray-900 dark:text-white">
        {activeFile.type === 'folder' ? (
          <Folder size={20} className="text-gray-400 dark:text-gray-500" />
        ) : (
          <FileText size={20} className="text-gray-400 dark:text-gray-500" />
        )}
        <span>{activeFile.name}</span>
      </div>
    </div>
  );
}