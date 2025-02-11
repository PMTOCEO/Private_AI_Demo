import { useState, useEffect, useRef } from 'react';
import { User, Pencil, Copy, Trash2, Check, X, Volume2, RefreshCw } from 'lucide-react';
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
import { DeleteModal } from '../../User_Interface/Header/DeleteModal';
import { Message } from '../Utilities';
import { FormattingOptions } from './FormattingOptions';
import { richTextToPlain } from '../Utilities/richTextConversion';

interface ChatMessageProps {
  message: Message;
  isDarkMode?: boolean;
  onEdit?: (id: string, newContent: string) => void;
  onDelete?: (id: string) => void;
  onCopy?: () => void;
  onSend?: (content: string) => void;
  onRegenerate?: (id: string) => void;
}

export function ChatMessage({
  message,
  isDarkMode = true,
  onEdit,
  onDelete,
  onCopy,
  onSend,
  onRegenerate,
}: ChatMessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const isUser = message.role === 'user';
  const messageEndRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Underline,
      Strike,
      BulletList.configure({
        keepMarks: true,
        keepAttributes: false,
      }),
      OrderedList.configure({
        keepMarks: true,
        keepAttributes: false,
      }),
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
    editable: false,
  });

  // Handle editing mode
  useEffect(() => {
    if (isEditing && editor) {
      try {
        const parsed = JSON.parse(message.content);
        editor.commands.setContent(parsed.html);
      } catch {
        editor.commands.setContent(message.content);
      }
      editor.setEditable(true);
    }
  }, [isEditing, editor, message.content]);

  // Initialize content and handle typewriter effect
  useEffect(() => {
    if (isUser || !message.isNew) {
      try {
        const parsed = JSON.parse(message.content);
        setDisplayedContent(parsed.html);
      } catch {
        setDisplayedContent(message.content);
      }
      return;
    }

    // For new assistant messages, play typewriter effect
    setIsTyping(true);
    setDisplayedContent('');

    try {
      const content = JSON.parse(message.content).html;
      let currentText = '';
      let currentIndex = 0;

      const typingInterval = setInterval(() => {
        if (currentIndex < content.length) {
          currentText += content[currentIndex];
          setDisplayedContent(currentText);
          currentIndex++;

          // Scroll to bottom while typing
          if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          message.isNew = false;
        }
      }, 5); // AI response typing speed

      return () => clearInterval(typingInterval);
    } catch {
      setDisplayedContent(message.content);
      setIsTyping(false);
      message.isNew = false;
    }
  }, [message, isUser]);

  const handleCopy = () => {
    const plainText = richTextToPlain(message.content);
    navigator.clipboard.writeText(plainText);
    if (onCopy) onCopy();
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleReadAloud = () => {
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    const plainText = richTextToPlain(message.content);
    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.onend = () => setIsReading(false);
    setIsReading(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate(message.id);
    }
  };

  const handleSaveEdit = () => {
    if (editor && onEdit) {
      const htmlContent = editor.getHTML();
      const plainText = editor.getText();
      
      if (plainText.trim()) {
        onEdit(message.id, JSON.stringify({
          html: htmlContent,
          text: plainText.trim()
        }));
      }
      setIsEditing(false);
      editor.setEditable(false);
    }
  };

  return (
    <div
      className={`group flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div
        className={`flex h-8 w-8 shrink-0 select-none items-center justify-center ${
          isUser
            ? `rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`
            : 'bg-transparent'
        }`}
      >
        {isUser ? (
          <User
            className={
              isDarkMode ? 'h-5 w-5 text-gray-200' : 'h-5 w-5 text-gray-600'
            }
          />
        ) : (
          <div className="relative">
            <img
              src={
                isDarkMode
                  ? 'https://43605540.fs1.hubspotusercontent-na1.net/hubfs/43605540/PENTOS/Logos/Web%20Optimized/Emblem%20Only/Pentos%20Emblem%20(White).png'
                  : 'https://43605540.fs1.hubspotusercontent-na1.net/hubfs/43605540/PENTOS/Logos/Web%20Optimized/Emblem%20Only/Pentos%20Emblem%20(Black).png'
              }
              alt="Pentos Logo"
              className="relative h-8 w-8 object-contain"
            />
          </div>
        )}
      </div>

      <div
        className={`relative inline-block max-w-[calc(80%-2rem)] rounded-lg px-4 py-2 transition-all duration-300 ${
          isUser
            ? `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`
            : `bg-gray-500 text-white`
        }`}
      >
        {isEditing ? (
          <div className="flex w-full flex-col gap-2">
            <FormattingOptions editor={editor} isDarkMode={isDarkMode} />
            <div className={`rounded-lg border ${
              isDarkMode 
                ? 'border-gray-600' 
                : 'border-gray-300'
            }`}>
              <EditorContent editor={editor} />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  editor?.setEditable(false);
                }}
                className={`flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-white transition-all duration-100 hover:border-1 hover:border-white ${
                  isDarkMode
                    ? 'bg-gray-800 hover:bg-gray-900'
                    : 'bg-gray-400 hover:bg-gray-500'
                }`}
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className={`flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-white transition-all duration-100 hover:border-1 hover:border-white ${
                  isDarkMode
                    ? 'bg-gray-800 hover:bg-gray-900'
                    : 'bg-gray-500 hover:bg-gray-600'
                }`}
              >
                <Check className="h-4 w-4" />
                Send
              </button>
            </div>
          </div>
        ) : (
          <>
            <div 
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: displayedContent }}
            />
            {showActions && !isTyping && (
              <div
                className={`absolute ${
                  isUser ? 'right-full' : 'left-full'
                } top-1/2 flex -translate-y-1/2 gap-1 px-2`}
              >
                <button
                  onClick={() => setIsEditing(true)}
                  className={`rounded-full p-1 transition-colors ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'
                  }`}
                >
                  <Pencil
                    className={`h-4 w-4 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  />
                </button>
                <button
                  onClick={handleCopy}
                  className={`rounded-full p-1 transition-colors ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'
                  }`}
                >
                  <Copy
                    className={`h-4 w-4 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  />
                </button>
                <button
                  onClick={handleDelete}
                  className={`rounded-full p-1 transition-colors ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'
                  }`}
                >
                  <Trash2
                    className={`h-4 w-4 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  />
                </button>
                {!isUser && (
                  <>
                    <button
                      onClick={handleReadAloud}
                      className={`rounded-full p-1 transition-colors ${
                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'
                      } ${isReading ? 'text-black' : ''}`}
                    >
                      <Volume2
                        className={`h-4 w-4 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      />
                    </button>
                    <button
                      onClick={handleRegenerate}
                      className={`rounded-full p-1 transition-colors ${
                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'
                      }`}
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      />
                    </button>
                  </>
                )}
              </div>
            )}
            <div ref={messageEndRef} />
          </>
        )}
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (onDelete) {
            onDelete(message.id);
          }
          setIsDeleteModalOpen(false);
        }}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}