import { Editor } from '@tiptap/react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface AlignmentOptionsProps {
  editor: Editor;
  onClose: () => void;
  isDarkMode: boolean;
}

export function AlignmentOptions({ editor, onClose, isDarkMode }: AlignmentOptionsProps) {
  const options = [
    {
      name: 'Left Align',
      icon: AlignLeft,
      action: () => editor.chain().focus().setTextAlign('left').run(),
      isActive: editor.isActive({ textAlign: 'left' })
    },
    {
      name: 'Center Align',
      icon: AlignCenter,
      action: () => editor.chain().focus().setTextAlign('center').run(),
      isActive: editor.isActive({ textAlign: 'center' })
    },
    {
      name: 'Right Align',
      icon: AlignRight,
      action: () => editor.chain().focus().setTextAlign('right').run(),
      isActive: editor.isActive({ textAlign: 'right' })
    }
  ];

  return (
    <div 
      className={`absolute z-50 mt-1 rounded-lg shadow-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } p-2 min-w-[150px]`}
    >
      {options.map(({ name, icon: Icon, action, isActive }) => (
        <button
          key={name}
          className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm ${
            isActive
              ? isDarkMode 
                ? 'bg-gray-700 text-white' 
                : 'bg-gray-100 text-gray-900'
              : isDarkMode
                ? 'text-gray-200 hover:bg-gray-700'
                : 'text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => {
            action();
            onClose();
          }}
        >
          <Icon size={16} />
          <span>{name}</span>
        </button>
      ))}
    </div>
  );
}