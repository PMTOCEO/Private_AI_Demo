import React, { useState } from 'react';
import { X, Tag as TagIcon } from 'lucide-react';
import { TagItem } from './TagItem';

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  chatTitle: string;
  existingTags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export function TagModal({
  isOpen,
  onClose,
  isDarkMode,
  chatTitle,
  existingTags,
  onAddTag,
  onRemoveTag,
}: TagModalProps) {
  const [newTag, setNewTag] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim()) {
      // Split by commas and filter out empty strings
      const tags = newTag
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Add each tag
      tags.forEach(tag => {
        if (!existingTags.includes(tag)) {
          onAddTag(tag);
        }
      });

      setNewTag('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`relative w-full max-w-md rounded-lg ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      } p-6 shadow-xl`}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Manage Tags
          </h2>
          <button
            onClick={onClose}
            className={`rounded-full p-2 ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <X className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className={`rounded-full p-3 ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <TagIcon className={`h-8 w-8 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-700'
              }`} />
            </div>
            <div className="text-center">
              <p className={`mb-2 text-lg font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Tags for "{chatTitle}"
              </p>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Add multiple tags at once by separating them with commas
              </p>
            </div>
          </div>

          <div className={`rounded-lg border p-4 ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <div className="mb-4 flex flex-wrap gap-2">
              {existingTags.map(tag => (
                <TagItem
                  key={tag}
                  tag={tag}
                  onRemove={onRemoveTag}
                  isDarkMode={isDarkMode}
                />
              ))}
              {existingTags.length === 0 && (
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No tags yet. Add some below!
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add tags (e.g. work, important, follow-up)"
                className={`flex-1 rounded-lg border px-3 py-2 ${
                  isDarkMode 
                    ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-500' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:ring-1 focus:ring-gray-500`}
              />
              <button
                type="submit"
                disabled={!newTag.trim()}
                className={`rounded-lg px-4 py-2 font-medium text-white transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-600 hover:bg-gray-700'
                } disabled:opacity-50`}
              >
                Add
              </button>
            </form>
          </div>

          <button
            onClick={onClose}
            className={`w-full rounded-lg px-4 py-2 font-medium text-white transition-colors ${
              isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-700' 
                : 'bg-gray-500 hover:bg-gray-600'
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}