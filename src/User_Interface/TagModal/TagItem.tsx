import { X } from 'lucide-react';

interface TagItemProps {
  tag: string;
  onRemove: (tag: string) => void;
  isDarkMode: boolean;
}

export function TagItem({ tag, onRemove, isDarkMode }: TagItemProps) {
  return (
    <div
      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-sm ${
        isDarkMode 
          ? 'bg-gray-700 text-gray-300' 
          : 'bg-gray-100 text-gray-700'
      }`}
    >
      <span>{tag}</span>
      <button
        onClick={() => onRemove(tag)}
        className="ml-1 rounded-full p-0.5 hover:bg-gray-600/20"
        aria-label={`Remove ${tag} tag`}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}