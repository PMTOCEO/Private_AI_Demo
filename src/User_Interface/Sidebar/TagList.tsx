import { Tag, X } from 'lucide-react';
import { Chat } from '../../Chat/Utilities';

interface TagListProps {
  tags: string[];
  selectedTag?: string;
  isDarkMode: boolean;
  onTagSelect: (tag: string | undefined) => void;
  pinnedChats: Chat[];
  recentChats: Chat[];
}

export function TagList({
  tags,
  selectedTag,
  isDarkMode,
  onTagSelect,
  pinnedChats,
  recentChats
}: TagListProps) {
  return (
    <div>
      <button className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left space-y-2 ${
        isDarkMode 
          ? 'text-gray-400 hover:bg-gray-800 hover:text-white' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}>
        <Tag className="h-5 w-5 shrink-0" />
        <div className="flex flex-col">
          <span>Tags</span>
        </div>
      </button>
      <div className="ml-4 mt-1 space-y-1">
        {selectedTag && (
          <button
            onClick={() => onTagSelect(undefined)}
            className={`mb-2 flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
              isDarkMode 
                ? 'text-gray-400 hover:bg-gray-800' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <X className="h-4 w-4" />
            Clear filter
          </button>
        )}
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => onTagSelect(tag)}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left ${
              tag === selectedTag
                ? isDarkMode
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-900'
                : isDarkMode
                  ? 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span className="truncate">{tag}</span>
            </div>
            <span className="text-xs opacity-60">
              {pinnedChats.concat(recentChats).filter(chat => chat.tags?.includes(tag)).length}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}