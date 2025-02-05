import React, { useState, useEffect, useCallback } from 'react';
import { HelpCircle } from 'lucide-react';
import { SidebarHeader } from './SidebarHeader';
import { SidebarResizer } from './SidebarResizer';
import { SidebarActions } from './SidebarActions';
import { ChatList } from './ChatList';
import { TagList } from './TagList';
import { HelpSupport } from './HelpSupport';
import { Chat } from '../../Chat/Utilities';


interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
  onNewChat: () => void;
  recentChats: Chat[];
  pinnedChats: Chat[];
  selectedChatId?: string;
  selectedTag?: string;
  onChatSelect: (id: string) => void;
  onTagSelect: (tag: string | undefined) => void;
  onPin: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  onAddTag: (id: string, tag: string) => void;
  onRemoveTag: (id: string, tag: string) => void;
  onDownload: (format: 'json' | 'txt' | 'pdf') => void;
  onDelete: (id: string) => void;
  onOpenSettings: () => void;
}

export function Sidebar({
  isOpen,
  onToggle,
  isDarkMode,
  onNewChat,
  recentChats,
  pinnedChats,
  selectedChatId,
  selectedTag,
  onChatSelect,
  onTagSelect,
  onPin,
  onRename,
  onAddTag,
  onRemoveTag,
  onDownload,
  onDelete,
  onOpenSettings
}: SidebarProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    setStartX(e.clientX);
    setStartWidth(sidebarWidth);
    document.documentElement.classList.add('resize-active');
  }, [sidebarWidth]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    document.documentElement.classList.remove('resize-active');
  }, []);

  const handleResize = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    const newWidth = startWidth + (e.clientX - startX);
    const minWidth = isOpen ? 256 : 64;
    const maxWidth = window.innerWidth * 0.8; // 80% of window width
    
    setSidebarWidth(Math.min(Math.max(newWidth, minWidth), maxWidth));
  }, [isResizing, startWidth, startX, isOpen]);

  const handleToggle = useCallback(() => {
    if (isOpen) {
      setSidebarWidth(64);
    } else {
      setSidebarWidth(256);
    }
    onToggle();
  }, [isOpen, onToggle]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', handleResizeEnd);
      return () => {
        window.removeEventListener('mousemove', handleResize);
        window.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleResize, handleResizeEnd]);

  const allTags = Array.from(new Set([
    ...pinnedChats.flatMap(chat => chat.tags || []),
    ...recentChats.flatMap(chat => chat.tags || [])
  ])).sort();

  return (
    <div
      className={`relative flex flex-col border-r ${
        isDarkMode 
          ? 'border-gray-800 bg-gray-900' 
          : 'border-gray-200 bg-white'
      } ${isResizing ? 'sidebar-resize' : 'sidebar-transition'}`}
      style={{ width: `${sidebarWidth}px` }}
    >
      <SidebarHeader
        isOpen={isOpen}
        isDarkMode={isDarkMode}
        onToggle={handleToggle}
      />

      <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        <SidebarActions
          isOpen={isOpen}
          isDarkMode={isDarkMode}
          onSettingsOpen={onOpenSettings}
          onNewChat={onNewChat}
        />

        {isOpen && (
          <>
            <ChatList
              pinnedChats={pinnedChats}
              recentChats={recentChats}
              selectedChatId={selectedChatId}
              isDarkMode={isDarkMode}
              onChatSelect={onChatSelect}
              onPin={onPin}
              onRename={onRename}
              onAddTag={onAddTag}
              onRemoveTag={onRemoveTag}
              onDownload={onDownload}
              onDelete={onDelete}
            />

            <TagList
              tags={allTags}
              selectedTag={selectedTag}
              isDarkMode={isDarkMode}
              onTagSelect={onTagSelect}
              pinnedChats={pinnedChats}
              recentChats={recentChats}
            />
          </>
        )}
      </div>

      <div className="mt-auto">
        <button
          onClick={() => setIsHelpOpen(true)}
          className={`flex w-full items-center justify-center gap-3 rounded-lg px-3 py-2 text-left ${
            isDarkMode 
              ? 'text-gray-400 hover:bg-gray-800 hover:text-white' 
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <HelpCircle className="h-5 w-5 shrink-0" />
          {isOpen && <span>Help & Support</span>}
        </button>
      </div>

      <HelpSupport
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        isDarkMode={isDarkMode}
        sidebarWidth={sidebarWidth}
      />

      <SidebarResizer onMouseDown={handleResizeStart} />
    </div>
  );
}