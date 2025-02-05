import React from 'react';

interface Position {
  x: number;
  y: number;
}

interface ContextMenuProps {
  position: Position;
  onClose: () => void;
  children: React.ReactNode;
}

export function ContextMenu({ position, onClose, children }: ContextMenuProps) {
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-context-menu]')) {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  return (
    <div
      data-context-menu
      className="fixed z-50 min-w-[200px] bg-white dark:bg-gray-800 rounded-lg shadow-lg 
        border border-gray-200 dark:border-gray-700 py-1"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
      }}
    >
      {children}
    </div>
  );
}