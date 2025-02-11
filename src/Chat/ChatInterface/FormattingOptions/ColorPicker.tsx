import { Editor } from '@tiptap/react';

interface ColorPickerProps {
  editor: Editor;
  onClose: () => void;
  isDarkMode: boolean;
  isHighlight: boolean;
}

export function ColorPicker({ editor, onClose, isDarkMode, isHighlight }: ColorPickerProps) {
  const TEXT_COLORS = [
    { name: 'Default', value: 'inherit' },
    { name: 'Gray', value: '#6B7280' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Yellow', value: '#F59E0B' },
    { name: 'Green', value: '#10B981' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' },
  ];

  const HIGHLIGHT_COLORS = [
    { name: 'Yellow', value: '#FEF08A' },
    { name: 'Green', value: '#BBF7D0' },
    { name: 'Blue', value: '#BFDBFE' },
    { name: 'Purple', value: '#DDD6FE' },
    { name: 'Pink', value: '#FBCFE8' },
  ];

  const colors = isHighlight ? HIGHLIGHT_COLORS : TEXT_COLORS;

  const handleColorSelect = (color: string) => {
    if (isHighlight) {
      editor.chain().focus().toggleHighlight({ color }).run();
    } else {
      editor.chain().focus().setColor(color).run();
    }
    onClose();
  };

  return (
    <div 
      className={`absolute z-50 mt-1 rounded-lg shadow-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } p-2 min-w-[150px]`}
    >
      {colors.map(({ name, value }) => (
        <button
          key={value}
          className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm ${
            isDarkMode 
              ? 'hover:bg-gray-700' 
              : 'hover:bg-gray-100'
          }`}
          onClick={() => handleColorSelect(value)}
        >
          <div 
            className="h-4 w-4 rounded-full border"
            style={{ 
              backgroundColor: value,
              borderColor: isDarkMode ? '#4B5563' : '#D1D5DB'
            }}
          />
          <span className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
            {name}
          </span>
        </button>
      ))}
    </div>
  );
}