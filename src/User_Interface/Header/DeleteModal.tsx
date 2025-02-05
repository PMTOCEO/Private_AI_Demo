import { AlertTriangle, X } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDarkMode: boolean;
}

export function DeleteModal({ isOpen, onClose, onConfirm, isDarkMode }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`relative w-full max-w-md rounded-lg ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      } p-6 shadow-xl`}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Delete Chat
          </h2>
          <button
            onClick={onClose}
            className={`rounded-full p-2 ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-1 00'
            }`}
          >
            <X className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className={`rounded-full p-3 ${
              isDarkMode ? 'bg-red-500/10' : 'bg-red-50'
            }`}>
              <AlertTriangle className={`h-8 w-8 ${
                isDarkMode ? 'text-red-400' : 'text-red-600'
              }`} />
            </div>
            <div>
              <p className={`mb-2 text-lg font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Are you sure you want to delete this chat?
              </p>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className={`flex-1 rounded-lg border px-4 py-2 font-medium transition-all duration-300 ${
                isDarkMode 
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-800' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-all duration-300 hover:bg-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}