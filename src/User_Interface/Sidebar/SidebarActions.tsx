import { useState } from 'react';
import { Settings, User, MessageSquarePlus } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { UserModal } from '../../Authentication/UserModal';

interface SidebarActionsProps {
  isOpen: boolean;
  isDarkMode: boolean;
  onSettingsOpen: () => void;
  onNewChat: () => void;
}

export function SidebarActions({
  isOpen,
  isDarkMode,
  onSettingsOpen,
  onNewChat
}: SidebarActionsProps) {
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  return (
    <>
      <div className="mb-4 space-y-2">
        <button
          onClick={() => isAuthenticated ? setIsUserModalOpen(true) : loginWithRedirect()}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${
            isDarkMode 
              ? 'text-gray-400 hover:bg-gray-800 hover:text-white' 
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <User className="h-5 w-5 shrink-0" />
          {isOpen && (
            <span>
              {isAuthenticated ? user?.email : 'Sign In'}
            </span>
          )}
        </button>

        <button
          onClick={onSettingsOpen}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${
            isDarkMode 
              ? 'text-gray-400 hover:bg-gray-800 hover:text-white' 
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {isOpen && <span>Settings</span>}
        </button>
      </div>

      {isOpen && (
        <div className={`mb-2 px-3 text-xs font-semibold uppercase ${
          isDarkMode ? 'text-gray-500' : 'text-gray-500'
        }`}>
          Chats
        </div>
      )}

      <button
        onClick={onNewChat}
        className={`mb-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${
          isDarkMode 
            ? 'text-white hover:bg-gray-800' 
            : 'text-black hover:bg-gray-100'
        }`}
      >
        <MessageSquarePlus className="h-5 w-5 shrink-0" />
        {isOpen && <span>New Chat</span>}
      </button>

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        isDarkMode={isDarkMode}
      />
    </>
  );
}