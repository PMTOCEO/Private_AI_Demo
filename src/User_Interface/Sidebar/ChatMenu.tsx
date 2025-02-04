import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Tag, Pin, Edit2, Download, Trash2 } from 'lucide-react';
import { DownloadModal } from '../../User_Interface/Header/DownloadModal';
import { DeleteModal } from '../../User_Interface/Header/DeleteModal';
import { TagModal } from '../TagModal/TagModal';

interface ChatMenuProps {
  chatId: string;
  title: string;
  tags: string[];
  isPinned: boolean;
  isDarkMode: boolean;
  onPin: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  onAddTag: (id: string, tag: string) => void;
  onRemoveTag: (id: string, tag: string) => void;
  onDownload: (format: 'json' | 'txt' | 'pdf') => void;
  onDelete: (id: string) => void;
}

export function ChatMenu({
  chatId,
  title,
  tags,
  isPinned,
  isDarkMode,
  onPin,
  onRename,
  onAddTag,
  onRemoveTag,
  onDownload,
  onDelete,
}: ChatMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && 
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuOpen = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.top - 14,
        left: rect.right + 24
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <button
        ref={buttonRef}
        onClick={handleMenuOpen}
        className={`cursor-pointer rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100 ${
          isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
        }`}
      >
        <MoreVertical className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
      </button>

      {isOpen && (
        <div 
          ref={menuRef}
          className={`fixed z-50 w-48 rounded-lg shadow-md ${
            isDarkMode ? 'bg-gray-800 ring-1 ring-gray-700 shadow-gray-800' : 'bg-white ring-1 ring-gray-200 shadow-gray-200'
          }`}
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`
          }}
        >
          <div className="py-1">
            <button
              onClick={() => {
                onPin(chatId);
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-4 py-2 text-sm ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Pin className="h-4 w-4" />
              {isPinned ? 'Unpin' : 'Pin'}
            </button>
            <button
              onClick={() => {
                setIsTagModalOpen(true);
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-4 py-2 text-sm ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Tag className="h-4 w-4" />
              Tags
            </button>
            <button
              onClick={() => {
                onRename(chatId, title);
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-4 py-2 text-sm ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Edit2 className="h-4 w-4" />
              Rename
            </button>
            <button
              onClick={() => {
                setIsDownloadModalOpen(true);
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-4 py-2 text-sm ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            <button
              onClick={() => {
                setIsDeleteModalOpen(true);
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-4 py-2 text-sm ${
                isDarkMode 
                  ? 'text-red-400 hover:bg-red-400/20' 
                  : 'text-red-600 hover:bg-red-50'
              }`}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      )}

      <TagModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        isDarkMode={isDarkMode}
        chatTitle={title}
        existingTags={tags}
        onAddTag={(tag) => onAddTag(chatId, tag)}
        onRemoveTag={(tag) => onRemoveTag(chatId, tag)}
      />

      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        isDarkMode={isDarkMode}
        onDownload={onDownload}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => onDelete(chatId)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}