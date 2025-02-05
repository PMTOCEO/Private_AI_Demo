import React from 'react';

interface SidebarResizerProps {
  onMouseDown: (e: React.MouseEvent) => void;
}

export function SidebarResizer({ onMouseDown }: SidebarResizerProps) {
  return (
    <div
      className="absolute right-0 top-0 h-full w-2 cursor-col-resize hover:bg-gray-400/10 transition-colors duration-200"
      onMouseDown={onMouseDown}
    />
  );
}