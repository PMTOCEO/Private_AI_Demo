import { X, User, Key, LogOut } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export function UserModal({ isOpen, onClose, isDarkMode }: UserModalProps) {
  const { user, logout } = useAuth0();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`relative w-full max-w-md rounded-lg ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      } p-6 shadow-xl`}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Account Settings
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
              <User className={`h-8 w-8 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-700'
              }`} />
            </div>
            <div>
              <p className={`text-lg font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {user?.name}
              </p>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {user?.email}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => {
                // Handle change username
                window.open('https://manage.auth0.com/dashboard/us/pentos/user-profile', '_blank');
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-800 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <User className="h-5 w-5" />
              <span>Change Username</span>
            </button>

            <button
              onClick={() => {
                // Handle change password
                window.open('https://manage.auth0.com/dashboard/us/pentos/password-reset', '_blank');
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-800 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Key className="h-5 w-5" />
              <span>Change Password</span>
            </button>

            <button
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left transition-colors ${
                isDarkMode 
                  ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30' 
                  : 'bg-red-50 text-red-600 hover:bg-red-100'
              }`}
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}