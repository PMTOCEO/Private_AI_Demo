import { Bold, Italic, List, Highlighter } from 'lucide-react';
import { Editor } from '@tiptap/react';

interface MenuBarProps {
  editor: Editor | null;
  isDarkMode: boolean;
}

export function MenuBar({ editor, isDarkMode }: MenuBarProps) {
  if (!editor) return null;

  const buttonClass = `p-1.5 rounded ${
    isDarkMode 
      ? 'text-gray-300 hover:bg-gray-800' 
      : 'text-gray-700 hover:bg-gray-100'
  } transition-colors duration-200`;

  const activeButtonClass = `${buttonClass} ${
    isDarkMode 
      ? 'bg-gray-800 text-white' 
      : 'bg-gray-100 text-gray-900'
  }`;

  return (
    <div className="flex items-center gap-1 px-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? activeButtonClass : buttonClass}
        title="Bold"
      >
        <Bold size={16} />
      </button>
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? activeButtonClass : buttonClass}
        title="Italic"
      >
        <Italic size={16} />
      </button>
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? activeButtonClass : buttonClass}
        title="Bullet List"
      >
        <List size={16} />
      </button>
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={editor.isActive('highlight') ? activeButtonClass : buttonClass}
        title="Highlight"
      >
        <Highlighter size={16} />
      </button>
    </div>
  );
}