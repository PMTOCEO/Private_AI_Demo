import React, { useState, useEffect, useRef } from 'react';

interface EditableTitleProps {
  title: string;
  isEditing: boolean;
  onEdit: (newTitle: string) => void;
  onEditStart: (e: React.MouseEvent) => void;
  onEditEnd: () => void;
  isDarkMode: boolean;
}

export function EditableTitle({
  title,
  isEditing,
  onEdit,
  onEditStart,
  onEditEnd,
  isDarkMode,
}: EditableTitleProps) {
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditedTitle(title);
  }, [title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    if (editedTitle.trim() && editedTitle !== title) {
      onEdit(editedTitle.trim());
    } else {
      setEditedTitle(title);
    }
    onEditEnd();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditedTitle(title);
      onEditEnd();
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        onBlur={handleSubmit}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        className={`w-full rounded border px-1 py-0.5 text-sm font-medium ${
          isDarkMode
            ? 'border-gray-700 bg-gray-800 text-white focus:border-gray-600'
            : 'border-gray-300 bg-white text-gray-900 focus:border-gray-400'
        } focus:outline-none`}
      />
    );
  }

  return (
    <span 
      className="cursor-text truncate font-medium"
      onClick={onEditStart}
    >
      {title}
    </span>
  );
}