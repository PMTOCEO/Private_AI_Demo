import React from 'react';
import { 
  DndContext, 
  DragEndEvent,
  DragOverEvent, 
  DragOverlay,
  useSensor, 
  useSensors, 
  PointerSensor,
  closestCenter
} from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useFiles } from '../../context/FilesContext';
import { useSearch } from '../../context/SearchContext';
import { FileModal } from '../FileDetails/FileModal';
import { SortableItem } from './SortableItem';
import { TableHeader } from './TableHeader';
import { DragOverlayContent } from './DragOverlay';
import type { FileItem } from '../../types/file';

interface FilesTableProps {
  type: 'my-files' | 'shared';
  files: FileItem[];
  onFileUpdate: (fileId: string, updates: Partial<FileItem>) => Promise<void>;
  onFileDelete: (fileId: string, storagePath: string) => Promise<void>;
}

export function FilesTable({ type, files, onFileUpdate, onFileDelete }: FilesTableProps) {
  const { searchQuery, searchResults } = useSearch();
  const [selectedFile, setSelectedFile] = React.useState<FileItem | null>(null);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [overId, setOverId] = React.useState<string | null>(null);
  const [isDraggingOverFolder, setIsDraggingOverFolder] = React.useState(false);
  const [editingFileId, setEditingFileId] = React.useState<string | null>(null);
  const [editingName, setEditingName] = React.useState('');

  // Use search results if there's a search query, otherwise use filtered files
  const displayedFiles = searchQuery
    ? searchResults
    : files.filter(file => 
        type === 'my-files' 
          ? !file.shared 
          : file.shared
      );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragOver = (event: DragOverEvent) => {
    const { over, active } = event;
    if (!over) {
      setOverId(null);
      setIsDraggingOverFolder(false);
      return;
    }

    const overFile = displayedFiles.find(f => f.id === over.id);
    if (overFile?.type === 'folder' && active.id !== over.id) {
      setOverId(over.id as string);
      setIsDraggingOverFolder(true);
      event.over = null;
    } else {
      setOverId(null);
      setIsDraggingOverFolder(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);
    setIsDraggingOverFolder(false);

    if (!over) return;

    const overFile = displayedFiles.find(f => f.id === over.id);
    
    if (overFile?.type === 'folder' && active.id !== over.id) {
      onFileUpdate(active.id as string, { parentId: over.id as string });
      return;
    }

    const newIndex = displayedFiles.findIndex(f => f.id === over.id);
    onFileUpdate(active.id as string, { order: newIndex });
  };

  const handleItemClick = (file: FileItem) => {
    if (file.type === 'folder') {
      // Handle folder navigation if needed
    } else {
      setSelectedFile(file);
    }
  };

  const handleStartRename = (fileId: string) => {
    const file = displayedFiles.find(f => f.id === fileId);
    if (file) {
      setEditingFileId(fileId);
      setEditingName(file.name);
    }
  };

  const handleEditComplete = () => {
    if (editingFileId && editingName.trim()) {
      onFileUpdate(editingFileId, { name: editingName });
    }
    setEditingFileId(null);
    setEditingName('');
  };

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
        <TableHeader />
        
        {displayedFiles.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            {searchQuery 
              ? 'No files found matching your search'
              : type === 'my-files' 
                ? 'No files found' 
                : 'No shared files found'
            }
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={(event) => setActiveId(event.active.id as string)}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={displayedFiles.map(f => f.id)}
              strategy={verticalListSortingStrategy}
            >
              {displayedFiles.map((file) => (
                <SortableItem 
                  key={file.id}
                  file={file}
                  onItemClick={() => handleItemClick(file)}
                  isOver={overId === file.id}
                  isDraggingOverFolder={isDraggingOverFolder}
                  isEditing={editingFileId === file.id}
                  editingName={editingName}
                  onEditingNameChange={setEditingName}
                  onEditComplete={handleEditComplete}
                  onStartRename={() => handleStartRename(file.id)}
                  onDelete={() => onFileDelete(file.id, file.storagePath)}
                />
              ))}
            </SortableContext>
            <DragOverlay>
              {activeId && (
                <DragOverlayContent 
                  activeFile={displayedFiles.find(f => f.id === activeId)} 
                />
              )}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {selectedFile && (
        <FileModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
}