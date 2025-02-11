import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import ListItem from '@tiptap/extension-list-item';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import { FormattingOptions } from './FormattingOptions';
import type { EditorView } from '@tiptap/pm/view';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isDarkMode?: boolean;
}

export function ChatInput({ onSend, disabled, isDarkMode = true }: ChatInputProps) {
  const [prevDarkMode, setPrevDarkMode] = useState(isDarkMode);

  useEffect(() => {
    setPrevDarkMode(isDarkMode);
  }, [isDarkMode]);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Underline,
      Strike,
      BulletList,
      OrderedList,
      ListItem.configure({
        HTMLAttributes: {
          class: 'list-item',
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'task-list',
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'task-item',
        },
      }),
      Highlight.configure({ 
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['paragraph', 'heading'],
        alignments: ['left', 'center', 'right'],
      }),
      TextStyle,
      Color,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: `flex-1 w-full rounded-lg px-4 py-3 ${
          isDarkMode 
            ? 'bg-gray-800 text-white' 
            : 'bg-white text-gray-800'
        } focus:outline-none min-h-[48px] max-h-[200px] overflow-y-auto`,
      },
      handleKeyDown: (view: EditorView, event: KeyboardEvent): boolean => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          handleSubmit(event as any);
          return true;
        }
        return false;
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor || editor.isEmpty || disabled) return;

    const htmlContent = editor.getHTML();
    const plainText = editor.getText();
    
    if (plainText.trim()) {
      onSend(JSON.stringify({
        html: htmlContent,
        text: plainText.trim()
      }));
      editor.commands.setContent('');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <FormattingOptions editor={editor} isDarkMode={isDarkMode} />
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className={`flex-1 rounded-lg border ${
          isDarkMode 
            ? 'border-gray-700' 
            : 'border-gray-400'
        }`}>
          <EditorContent editor={editor} />
        </div>
        
        <button
          type="submit"
          disabled={disabled || !editor?.getText().trim()}
          className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-white hover:border-1 hover:border-white ${
            isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-400 hover:bg-gray-500'
          } disabled:opacity-50 h-12 self-end`}
        >
          <Send className="h-5 w-5 text-white" />
        </button>
      </form>
    </div>
  );
}