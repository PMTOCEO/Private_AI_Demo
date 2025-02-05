import { X, FileJson, FileText, FileType, Download, Lock } from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onDownload: (format: 'json' | 'txt' | 'pdf') => void;
}

export function DownloadModal({ isOpen, onClose, isDarkMode, onDownload }: DownloadModalProps) {
  if (!isOpen) return null;

  const handleDownload = (format: 'json' | 'txt' | 'pdf') => {
    if (format === 'pdf') return; // PDF is premium only
    onDownload(format);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`relative w-full max-w-md rounded-lg ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      } p-6 shadow-xl`}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Download Chat
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
              <Download className={`h-8 w-8 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-700'
              }`} />
            </div>
            <div>
              <p className={`mb-2 text-lg font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Download this chat
              </p>
            </div>
          </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleDownload('json')}
              className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-all duration-300 ${
                isDarkMode 
                  ? 'border-gray-800 bg-gray-800 hover:bg-gray-700' 
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileJson className={`h-5 w-5 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`} />
                <div>
                  <p className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>JSON Format</p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-700'
                  }`}>Download as structured data</p>
                </div>
              </div>
              <Download className={`h-5 w-5 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`} />
            </button>

            <button
              onClick={() => handleDownload('txt')}
              className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-all duration-300 ${
                isDarkMode 
                  ? 'border-gray-800 bg-gray-800 hover:bg-gray-700' 
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className={`h-5 w-5 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`} />
                <div>
                  <p className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Text Format</p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-700'
                  }`}>Download as plain text</p>
                </div>
              </div>
              <Download className={`h-5 w-5 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`} />
            </button>

            <button
              onClick={() => handleDownload('pdf')}
              className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-all duration-300 ${
                isDarkMode 
                ? 'border-2 border-gray-800 bg-gray-900 hover:bg-gray-900' 
                  : 'border-2 border-gray-100 bg-white hover:white'
              }`}
              disabled
            >
              <div className="flex items-center gap-3">
                <FileType className={`h-5 w-5 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-900'
                }`} />
                <div>
                  <p className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>PDF Format</p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-700'
                  }`}>Upgrade now to download as a PDF</p>
                </div>
              </div>
              <Lock className={`h-5 w-5 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-900'
              }`} />
            </button>
          </div>

          <div className="space-y-2">
            <button
              onClick={onClose}
              className={`w-full rounded-lg px-4 py-2 font-medium text-white transition-all duration-100 hover:border-1 hover:border-white ${
                isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-500 hover:bg-gray-600'
              }`}
            >
              Upgrade Now
            </button>

            <button
              onClick={onClose}
              className={`w-full rounded-lg px-4 py-2 font-medium text-white transition-all duration-100 hover:border-1 hover:border-white ${
                isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-500 hover:bg-gray-600'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}