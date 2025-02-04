import { LucideIcon } from 'lucide-react';

interface ContextMenuItemProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  className?: string;
}

export function ContextMenuItem({ icon: Icon, label, onClick, className = '' }: ContextMenuItemProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`w-full flex items-center space-x-2 px-4 py-2 text-sm
        text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
        transition-colors duration-200 ${className}`}
    >
      <Icon size={16} className="text-gray-500 dark:text-gray-400" />
      <span>{label}</span>
    </button>
  );
}