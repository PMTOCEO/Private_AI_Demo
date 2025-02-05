import { X, Clock, Check } from 'lucide-react';

interface AddTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onConfirm: () => void;
}

export function AddTimeModal({ isOpen, onClose, isDarkMode, onConfirm }: AddTimeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`relative w-full max-w-md rounded-lg ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      } p-6 shadow-xl`}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-white-900'}`}>
            Premium Feature
          </h2>
          <button
            onClick={onClose}
            className={`rounded-full p-2 ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <X className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className={`rounded-full p-3 ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <Clock className={`h-8 w-8 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-700'
              }`} />
            </div>
            <div>
              <p className={`mb-2 text-lg font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Extended Chat Retention
              </p>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-700'
              }`}>
                Upgrade to our premium plan to keep your chats for as long as you want
              </p>
            </div>
          </div>

          <div className={`rounded-lg border ${
            isDarkMode ? 'border-gray-800 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
          } p-4`}>
            <div className="flex items-start gap-3">
              <div className={`rounded-full p-1 ${
                isDarkMode ? 'bg-gray-700/10' : 'bg-gray-200'
              }`}>
                <Check className={`h-4 w-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`} />
              </div>
              <div className="flex-1">
                <p className={`font-medium ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  $4.99/month
                </p>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-700'
                }`}>
                  Includes unlimited chat retention and premium features
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`w-full rounded-lg px-4 py-2 font-medium text-white transition-all duration-100 hover:border-1 hover:border-white ${
              isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-500 hover:bg-gray-600'
            }`}
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}