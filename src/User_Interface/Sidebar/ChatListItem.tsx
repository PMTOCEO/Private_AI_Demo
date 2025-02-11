import React, { useState, useEffect } from 'react';
import { Pin } from 'lucide-react';
import { Chat } from '../../Chat/Utilities';
import { ChatMenu } from './ChatMenu';
import { richTextToPreview } from '../../Chat/Utilities/richTextConversion';

interface ChatListItemProps {
  chat: Chat;
  isSelected: boolean;
  onClick: () => void;
  isDarkMode: boolean;
  onPin: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  onAddTag: (id: string, tag: string) => void;
  onRemoveTag: (id: string, tag: string) => void;
  onDownload: (format: 'json' | 'txt' | 'pdf') => void;
  onDelete: (id: string) => void;
}

export function ChatListItem({
  chat,
  isSelected,
  onClick,
  isDarkMode,
  onPin,
  onRename,
  onAddTag,
  onRemoveTag,
  onDownload,
  onDelete
}: ChatListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(chat.title);

  useEffect(() => {
    setEditedTitle(chat.title);
  }, [chat.title]);

  const handleRename = () => {
    setIsEditing(true);
  };

  const handleTitleSubmit = () => {
    if (editedTitle.trim() && editedTitle !== chat.title) {
      onRename(chat.id, editedTitle.trim());
    } else {
      setEditedTitle(chat.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditedTitle(chat.title);
      setIsEditing(false);
    }
  };

  // Convert rich text to plain text preview
  const messagePreview = richTextToPreview(chat.lastMessage);

  return (
    <div
      className={`group relative flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 ${
        isSelected
          ? isDarkMode
            ? 'bg-gray-800 text-white'
            : 'bg-gray-100 text-gray-900'
          : isDarkMode
            ? 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
      onClick={isEditing ? undefined : onClick}
    >
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleKeyDown}
              className={`w-full rounded border px-1 py-0.5 text-sm font-medium ${
                isDarkMode
                  ? 'border-gray-700 bg-gray-800 text-white focus:border-gray-600'
                  : 'border-gray-300 bg-white text-gray-900 focus:border-gray-400'
              } focus:outline-none`}
              autoFocus
            />
          ) : (
            <span className="truncate font-medium">{chat.title}</span>
          )}
          {chat.isPinned && <Pin className="h-3 w-3" />}
        </div>
        <span className="truncate text-xs opacity-60">{messagePreview}</span>
        {chat.tags && chat.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {chat.tags.map(tag => (
              <span
                key={tag}
                className={`rounded-full px-2 py-0.5 text-xs ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <ChatMenu
        chatId={chat.id}
        title={chat.title}
        tags={chat.tags || []}
        isPinned={chat.isPinned || false}
        isDarkMode={isDarkMode}
        onPin={onPin}
        onRename={handleRename}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
        onDelete={onDelete}
        onDownload={onDownload}
      />
    </div>
  );
}