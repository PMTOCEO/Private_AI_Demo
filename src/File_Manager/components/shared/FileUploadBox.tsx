import { Upload } from 'lucide-react';

interface FileUploadBoxProps {
  onClick: () => void;
  className?: string;
}

export function FileUploadBox({ onClick, className = '' }: FileUploadBoxProps) {
  return (
    <div
      onClick={onClick}
      className={`w-full h-48 flex flex-col items-center justify-center bg-white dark:bg-gray-800 
        text-gray-700 dark:text-gray-300 rounded-lg border-2 border-dashed border-gray-300 
        dark:border-gray-700 cursor-pointer hover:border-gray-400 dark:hover:border-gray-600
        ${className}`}
    >
      <Upload size={24} />
      <span className="mt-2 text-sm">Click to upload</span>
    </div>
  );
}