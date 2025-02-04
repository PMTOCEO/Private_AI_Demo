import { CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  show: boolean;
  isDarkMode: boolean;
}

export function SavedToClipboardMessagePopup({
  message,
  show,
  isDarkMode,
}: ToastProps) {
  if (!show) return null;

  return (
    <div className="fixed left-1/2 top-32 z-50 -translate-x-1/2 transform">
      <div
        className={`flex items-center gap-2 rounded-lg px-4 py-2 shadow-lg transition-all duration-300 ${
          isDarkMode
            ? 'bg-gray-800 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
            : 'bg-white text-gray-900 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
        }`}
      >
        <CheckCircle className="h-5 w-5 text-green-500" />
        <span>{message}</span>
      </div>
    </div>
  );
}
