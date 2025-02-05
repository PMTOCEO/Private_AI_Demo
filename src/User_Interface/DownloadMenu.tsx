import { useState } from 'react';
import { Download } from 'lucide-react';

interface DownloadMenuProps {
  onDownload: (format: 'json' | 'txt' | 'pdf') => void;
  isDarkMode: boolean;
  buttonClasses?: string;
}

export function DownloadMenu({ onDownload, isDarkMode, buttonClasses }: DownloadMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuBaseClasses = `absolute right-0 mt-2 w-32 rounded-md shadow-lg ${
    isDarkMode 
      ? 'bg-gray-800 ring-1 ring-black ring-opacity-5' 
      : 'bg-white ring-1 ring-black ring-opacity-5'
  }`;

  const menuItemClasses = `block w-full px-4 py-2 text-sm text-left ${
    isDarkMode
      ? 'text-gray-300 hover:bg-gray-700'
      : 'text-gray-700 hover:bg-gray-200'
  }`;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700 disabled:opacity-50 ${buttonClasses}`}
      >
        <Download className="h-5 w-5" />
        Download
      </button>

      {isOpen && (
        <div className={menuBaseClasses}>
          <div className="py-1">
            <button
              onClick={() => {
                onDownload('json');
                setIsOpen(false);
              }}
              className={menuItemClasses}
            >
              JSON
            </button>
            <button
              onClick={() => {
                onDownload('txt');
                setIsOpen(false);
              }}
              className={menuItemClasses}
            >
              TXT
            </button>
            <button
              onClick={() => {
                onDownload('pdf');
                setIsOpen(false);
              }}
              className={menuItemClasses}
            >
              PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}