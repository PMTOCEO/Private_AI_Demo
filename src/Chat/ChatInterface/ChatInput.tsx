import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isDarkMode?: boolean;
}

export function ChatInput({ onSend, disabled, isDarkMode = true }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [prevDarkMode, setPrevDarkMode] = useState(isDarkMode);

  useEffect(() => {
    setPrevDarkMode(isDarkMode);
  }, [isDarkMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const transitionClasses = prevDarkMode === isDarkMode ? 'transition-all duration-300' : '';

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={disabled}
        placeholder="How can I help?"
        className={`flex-1 rounded-lg border px-4 py-2 ${transitionClasses} ${
          isDarkMode 
            ? 'border-gray-700 bg-gray-800 text-white focus:border-gray-500 focus:outline-none focus:ring-0 focus:ring-gray-500' 
            : 'border-gray-400 bg-white text-gray-800 focus:border-gray-500 focus:outline-none focus:ring-0 focus:ring-gray-500'
        }`}
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-white ${transitionClasses} hover:border-1 hover:border-white ${
          isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-400 hover:bg-gray-500'
        } disabled:opacity-50`}
      >
        <Send className="h-5 w-5 text-white" />
      </button>
    </form>
  );
}