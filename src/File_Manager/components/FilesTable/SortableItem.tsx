import React from 'react';
import { Folder, FileText } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FileContextMenu } from '../FileContextMenu';
import type { FileItem } from '../../types/file';

interface SortableItemProps {
  file: FileItem;
  onItemClick: () => void;
  isOver: boolean;
  isDraggingOverFolder: boolean;
  isEditing: boolean;
  editingName: string;
  onEditingNameChange: (value: string) => void;
  onEditComplete: () => void;
  onStartRename: () => void;
}

export const SortableItem = React.memo(({ 
  file, 
  onItemClick, 
  isOver,
  isDraggingOverFolder,
  isEditing,
  editingName,
  onEditingNameChange,
  onEditComplete,
  onStartRename
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: file.id,
    data: {
      type: file.type,
      item: file,
    },
  });

  const style = {
    transform: CSS.Transform.toString(
      isDraggingOverFolder && file.type === 'folder' ? null : transform
    ),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEditComplete();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onEditComplete();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onItemClick();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`grid grid-cols-[auto_auto_1fr_1fr_1fr_1fr_1fr_auto] gap-4 p-4 items-center cursor-grab active:cursor-grabbing
        ${isDragging ? 'bg-gray-100 dark:bg-gray-800' : ''}
        ${isOver && file.type === 'folder' ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
        transition-colors duration-200`}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <FileContextMenu file={file} onRename={onStartRename} />
      </div>
      <div 
        className="text-gray-400 dark:text-gray-500"
        onClick={handleClick}
      >
        {file.type === 'folder' ? <Folder size={20} /> : <FileText size={20} />}
      </div>
      <div 
        className="cursor-pointer text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
        onClick={handleClick}
      >
        {isEditing ? (
          <input
            type="text"
            value={editingName}
            onChange={(e) => onEditingNameChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={onEditComplete}
            className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
              rounded focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500"
            autoFocus
          />
        ) : (
          file.name
        )}
      </div>
      <div className="text-gray-900 dark:text-white">{file.size}</div>
      <div className="text-gray-900 dark:text-white">{file.fileType?.displayName || (file.type === 'folder' ? 'Folder' : 'Unknown')}</div>
      <div className="text-gray-900 dark:text-white">{file.createdDate}</div>
      <div className="text-gray-900 dark:text-white">{file.lastModified || '—'}</div>
      <div className="w-6"></div>
    </div>
  );
});

SortableItem.displayName = 'SortableItem';