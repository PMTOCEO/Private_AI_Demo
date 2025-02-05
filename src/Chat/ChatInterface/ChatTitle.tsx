import React, { useState, useEffect, useRef } from 'react';
import { Edit2 } from 'lucide-react';

interface ChatTitleProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  isDarkMode: boolean;
  isEditing: boolean;
  onEditStart: () => void;
  onEditEnd: () => void;
}

export function ChatTitle({
  title,
  onTitleChange,
  isDarkMode,
  isEditing,
  onEditStart,
  onEditEnd,
}: ChatTitleProps) {
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update editedTitle when title prop changes or when entering edit mode
  useEffect(() => {
    setEditedTitle(title);
  }, [title, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    if (editedTitle.trim()) {
      onTitleChange(editedTitle.trim());
    } else {
      setEditedTitle(title);
    }
    onEditEnd();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setEditedTitle(title);
      onEditEnd();
    }
  };

  return (
    <div className={`flex items-center justify-between border-b px-6 py-3 ${
      isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
    }`}>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={handleKeyDown}
            className={`flex w-full flex-col rounded-lg border px-3 py-1 transition-all duration-300 ${
              isDarkMode
                ? 'border-gray-700 bg-gray-800 text-white focus:border-gray-500 focus:outline-none focus:ring-0 focus:ring-gray-500'
                : 'border-gray-400 bg-white text-gray-800 focus:border-gray-500 focus:outline-none focus:ring-0 focus:ring-gray-500'
            }`}
          />
        ) : (
          <button
            onClick={onEditStart}
            className={`flex items-center gap-2 rounded-lg px-3 py-1 ${
              isDarkMode ? 'text-white hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-100'
            }`}
          >
            <span className="font-medium">{title}</span>
            <Edit2 className={isDarkMode ? 'h-4 w-4 text-gray-200' : 'h-4 w-4 text-gray-800'} />
          </button>
        )}
      </div>
    </div>
  );
}