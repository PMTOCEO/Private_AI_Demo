import React from 'react';
import { 
  MoreVertical, 
  Pencil, 
  Share2, 
  FolderUp, 
  Trash2 
} from 'lucide-react';
import { ContextMenu } from './shared/ContextMenu';
import { ContextMenuItem } from './shared/ContextMenuItem';
import { useFiles } from '../context/FilesContext';
import { MoveFileModal } from './MoveFileModal';
import type { FileItem } from '../types/file';

interface FileContextMenuProps {
  file: FileItem;
  onRename: () => void;
}

export function FileContextMenu({ file, onRename }: FileContextMenuProps) {
  const { dispatch } = useFiles();
  const [showMenu, setShowMenu] = React.useState(false);
  const [menuPosition, setMenuPosition] = React.useState({ x: 0, y: 0 });
  const [showMoveModal, setShowMoveModal] = React.useState(false);

  const handleContextTrigger = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({ 
      x: rect.right + 8,
      y: rect.top
    });
    setShowMenu(true);
  };

  const handleShare = () => {
    dispatch({ type: 'TOGGLE_SHARE', payload: file.id });
    setShowMenu(false);
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_FILE', payload: file.id });
    setShowMenu(false);
  };

  const handleRenameClick = () => {
    onRename();
    setShowMenu(false);
  };

  return (
    <>
      <button
        onClick={handleContextTrigger}
        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400
          transition-colors duration-200"
      >
        <MoreVertical size={20} />
      </button>

      {showMenu && (
        <ContextMenu
          position={menuPosition}
          onClose={() => setShowMenu(false)}
        >
          <ContextMenuItem
            icon={Pencil}
            label="Rename"
            onClick={handleRenameClick}
          />
          <ContextMenuItem
            icon={Share2}
            label={file.shared ? 'Unshare' : 'Share'}
            onClick={handleShare}
          />
          <ContextMenuItem
            icon={FolderUp}
            label="Move"
            onClick={() => {
              setShowMoveModal(true);
              setShowMenu(false);
            }}
          />
          <ContextMenuItem
            icon={Trash2}
            label="Delete"
            onClick={handleDelete}
            className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          />
        </ContextMenu>
      )}

      {showMoveModal && (
        <MoveFileModal
          file={file}
          onClose={() => setShowMoveModal(false)}
        />
      )}
    </>
  );
}