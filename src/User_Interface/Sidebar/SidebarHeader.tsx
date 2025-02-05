import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarHeaderProps {
  isOpen: boolean;
  isDarkMode: boolean;
  onToggle: () => void;
}

export function SidebarHeader({ isOpen, isDarkMode, onToggle }: SidebarHeaderProps) {
  return (
    <div className={`flex h-16 items-center justify-between border-b-2 ${
      isDarkMode ? 'border-gray-800' : 'border-gray-200'
    } px-4`}>
      <div className={`flex items-center gap-3 ${!isOpen && 'hidden'}`}>
        <img 
          src={isDarkMode 
            ? "https://43605540.fs1.hubspotusercontent-na1.net/hubfs/43605540/PENTOS/Logos/Web%20Optimized/Full%20Logo/Pentos%20Full%20(White).png" 
            : "https://43605540.fs1.hubspotusercontent-na1.net/hubfs/43605540/PENTOS/Logos/Web%20Optimized/Full%20Logo/Pentos%20Full%20(Black).png"} 
          alt="Pentos Logo" 
          className="h-32 w-32 object-contain"
        />
      </div>
      <button
        onClick={onToggle}
        className={`rounded p-1 ${
          isDarkMode 
            ? 'hover:bg-gray-800' 
            : 'hover:bg-gray-100'
        }`}
      >
        {isOpen ? (
          <ChevronLeft className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        ) : (
          <ChevronRight className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        )}
      </button>
    </div>
  );
}