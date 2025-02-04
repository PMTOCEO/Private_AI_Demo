import { useEffect, useState } from 'react';
import { Download, Timer, Trash2, Plus, File } from 'lucide-react';

interface HeaderProps {
  onDownload: () => void;
  onDelete: () => void;
  expirationTime: number;
  onAddHour: () => void;
  isDarkMode: boolean;
  onFiles: () => void;
}

export function Header({ onDownload, onDelete, expirationTime, onAddHour, isDarkMode, onFiles }: HeaderProps) {
  const [prevDarkMode, setPrevDarkMode] = useState(isDarkMode);

  useEffect(() => {
    setPrevDarkMode(isDarkMode);
  }, [isDarkMode]);

  const timeLeft = Math.max(0, Math.floor((expirationTime - Date.now()) / 1000));
  const minutes = Math.floor(timeLeft / 60);
  
  const formatTimeLeft = () => {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  const transitionClasses = prevDarkMode === isDarkMode ? 'transition-all duration-150' : '';

  const buttonClasses = `flex transform items-center gap-2 h-10 min-w-[100px] whitespace-nowrap rounded-lg px-4 border ${transitionClasses} ${
    isDarkMode 
      ? 'bg-gray-900 text-white border-white hover:bg-gray-800' 
      : 'bg-white text-black border-black hover:bg-gray-100'
  }`;
  
  const redButtonClasses = `flex transform items-center gap-2 h-10 min-w-[100px] whitespace-nowrap rounded-lg bg-red-600 px-4 text-white ${transitionClasses} hover:bg-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]`;
  
  return (
    <div className={`flex h-16 items-center justify-between border-b-2 ${
      isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
    } px-6`}>
      <div className="flex items-center gap-4 min-w-0 flex-grow">
        <div className="flex items-center gap-2 min-w-0">
          <Timer className={`h-5 w-5 flex-shrink-0 ${isDarkMode ? 'text-white' : 'text-black'}`} />
          <span className={`text-medium truncate ${isDarkMode ? 'text-white' : 'text-black'}`}>
            {timeLeft > 0 ? `Expires in ${formatTimeLeft()}` : 'Expired'}
          </span>
        </div>
        <button
          onClick={onAddHour}
          className={buttonClasses}
        >
          <Plus className={`h-5 w-5 flex-shrink-0 ${isDarkMode ? 'text-white' : 'text-black'}`} />
          <span className="flex-shrink-0">Add 30m</span>
        </button>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onFiles}
          className={buttonClasses}
        >
          <File className={`h-5 w-5 flex-shrink-0 ${isDarkMode ? 'text-white' : 'text-black'}`} />
          <span className="flex-shrink-0">Files</span>
        </button>
        
        <button
          onClick={onDownload}
          className={buttonClasses}
        >
          <Download className={`h-5 w-5 flex-shrink-0 ${isDarkMode ? 'text-white' : 'text-black'}`} />
          <span className="flex-shrink-0">Download</span>
        </button>
        <button
          onClick={onDelete}
          className={redButtonClasses}
        >
          <Trash2 className="h-5 w-5 flex-shrink-0 text-white" />
          <span className="flex-shrink-0">Delete</span>
        </button>
      </div>
    </div>
  );
}