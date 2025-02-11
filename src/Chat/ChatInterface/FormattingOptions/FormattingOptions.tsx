import { Editor } from '@tiptap/react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Highlighter,
  Palette,
  List,
  ListOrdered,
  CheckSquare,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface FormattingOptionsProps {
  editor: Editor | null;
  isDarkMode: boolean;
}

export function FormattingOptions({ editor, isDarkMode }: FormattingOptionsProps) {
  const [showColors, setShowColors] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Set default text color based on dark mode
  useEffect(() => {
    if (editor) {
      editor.chain().focus().setColor(isDarkMode ? '#FFFFFF' : '#000000').run();
    }
  }, [editor, isDarkMode]);

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

  const dividerClass = `w-px h-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`;

  const TEXT_COLORS = [
    { id: 'white', name: 'White', value: '#FFFFFF' },
    { id: 'black', name: 'Black', value: '#000000' },
    { id: 'red', name: 'Red', value: '#EF4444' },
    { id: 'yellow', name: 'Yellow', value: '#F59E0B' },
    { id: 'green', name: 'Green', value: '#10B981' },
    { id: 'blue', name: 'Blue', value: '#3B82F6' },
    { id: 'purple', name: 'Purple', value: '#8B5CF6' },
  ];

  const HIGHLIGHT_COLORS = [
    { id: 'yellow-highlight', name: 'Yellow', value: '#F59E0B' },
    { id: 'red-highlight', name: 'Red', value: '#EF4444' },
    { id: 'green-highlight', name: 'Green', value: '#10B981' },
    { id: 'blue-highlight', name: 'Blue', value: '#3B82F6' },
    { id: 'purple-highlight', name: 'Purple', value: '#8B5CF6' },
  ];

  return (
    <div ref={containerRef} className="flex flex-wrap items-center gap-1 px-2">
      {/* Basic Formatting */}
      <div className="flex items-center gap-1">
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
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? activeButtonClass : buttonClass}
          title="Underline"
        >
          <Underline size={16} />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? activeButtonClass : buttonClass}
          title="Strikethrough"
        >
          <Strikethrough size={16} />
        </button>
      </div>

      <div className={dividerClass} />

      {/* Color Options */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => {
            setShowColors(!showColors);
            setShowHighlights(false);
          }}
          className={`${buttonClass} flex items-center gap-1`}
          title="Text Color"
        >
          <Palette size={16} />
          <div className="transition-transform duration-200" style={{ transform: showColors ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
            <ChevronDown className="h-3 w-3" />
          </div>
        </button>

        <div className={`flex items-center gap-1 overflow-hidden transition-all duration-200 ${
          showColors ? 'w-auto opacity-100' : 'w-0 opacity-0'
        }`}>
          {TEXT_COLORS.map(({ id, name, value }) => (
            <button
              key={id}
              className={`h-5 w-5 rounded-full border ${
                value === '#FFFFFF' ? 'border-gray-300 dark:border-gray-600' : 'border-transparent'
              } ${
                editor.isActive('textStyle', { color: value }) 
                  ? `ring-2 ring-offset-2 ${isDarkMode ? 'ring-gray-600 ring-offset-gray-900' : 'ring-gray-300 ring-offset-white'}`
                  : ''
              }`}
              style={{ backgroundColor: value }}
              onClick={() => editor.chain().focus().setColor(value).run()}
              title={name}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            setShowHighlights(!showHighlights);
            setShowColors(false);
          }}
          className={`${buttonClass} flex items-center gap-1`}
          title="Highlight Color"
        >
          <Highlighter size={16} />
          <div className="transition-transform duration-200" style={{ transform: showHighlights ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
            <ChevronDown className="h-3 w-3" />
          </div>
        </button>

        <div className={`flex items-center gap-1 overflow-hidden transition-all duration-200 ${
          showHighlights ? 'w-auto opacity-100' : 'w-0 opacity-0'
        }`}>
          {HIGHLIGHT_COLORS.map(({ id, name, value }) => (
            <button
              key={id}
              className={`h-5 w-5 rounded-full border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${
                editor.isActive('highlight', { color: value }) 
                  ? `ring-2 ring-offset-2 ${isDarkMode ? 'ring-gray-600 ring-offset-gray-900' : 'ring-gray-300 ring-offset-white'}`
                  : ''
              }`}
              style={{ backgroundColor: value }}
              onClick={() => editor.chain().focus().toggleHighlight({ color: value }).run()}
              title={name}
            />
          ))}
        </div>
      </div>

      <div className={dividerClass} />

      {/* List Options */}
      <div className="flex items-center gap-1">
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
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? activeButtonClass : buttonClass}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={editor.isActive('taskList') ? activeButtonClass : buttonClass}
          title="Task List"
        >
          <CheckSquare size={16} />
        </button>
      </div>

      <div className={dividerClass} />

      {/* Alignment Options */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? activeButtonClass : buttonClass}
          title="Left Align"
        >
          <AlignLeft size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? activeButtonClass : buttonClass}
          title="Center Align"
        >
          <AlignCenter size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? activeButtonClass : buttonClass}
          title="Right Align"
        >
          <AlignRight size={16} />
        </button>
      </div>
    </div>
  );
}