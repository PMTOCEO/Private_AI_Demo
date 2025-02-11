import { Editor } from '@tiptap/react';
import { List, ListOrdered, CheckSquare } from 'lucide-react';

interface ListOptionsProps {
  editor: Editor;
  onClose: () => void;
  isDarkMode: boolean;
}

export function ListOptions({ editor, onClose, isDarkMode }: ListOptionsProps) {
  const options = [
    {
      name: 'Bullet List',
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList')
    },
    {
      name: 'Numbered List',
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList')
    },
    {
      name: 'Task List',
      icon: CheckSquare,
      action: () => editor.chain().focus().toggleTaskList().run(),
      isActive: editor.isActive('taskList')
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