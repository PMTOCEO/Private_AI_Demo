import { History, Pin } from 'lucide-react';
import { Chat } from '../../Chat/Utilities';
import { ChatListItem } from './ChatListItem';

interface ChatListProps {
  pinnedChats: Chat[];
  recentChats: Chat[];
  selectedChatId?: string;
  isDarkMode: boolean;
  onChatSelect: (id: string) => void;
  onPin: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  onAddTag: (id: string, tag: string) => void;
  onRemoveTag: (id: string, tag: string) => void;
  onDownload: (format: 'json' | 'txt' | 'pdf') => void;
  onDelete: (id: string) => void;
}

export function ChatList({
  pinnedChats,
  recentChats,
  selectedChatId,
  isDarkMode,
  onChatSelect,
  onPin,
  onRename,
  onAddTag,
  onRemoveTag,
  onDownload,
  onDelete
}: ChatListProps) {
  return (
    <div className="space-y-4">
      <div>
        <button className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${
          isDarkMode 
            ? 'text-gray-400 hover:bg-gray-800 hover:text-white' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}>
          <Pin className="h-5 w-5 shrink-0" />
          <div className="flex flex-col">
            <span>Pinned Chats</span>
          </div>
        </button>
        <div className="ml-4 mt-1 space-y-1">
          {pinnedChats.map(chat => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isSelected={chat.id === selectedChatId}
              onClick={() => onChatSelect(chat.id)}
              isDarkMode={isDarkMode}
              onPin={onPin}
              onRename={onRename}
              onAddTag={onAddTag}
              onRemoveTag={onRemoveTag}
              onDownload={onDownload}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>

      <div>
        <button className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${
          isDarkMode 
            ? 'text-gray-400 hover:bg-gray-800 hover:text-white' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}>
          <History className="h-5 w-5 shrink-0" />
          <div className="flex flex-col">
            <span>Recent Chats</span>
          </div>
        </button>
        <div className="ml-4 mt-1 space-y-1">
          {recentChats.map(chat => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isSelected={chat.id === selectedChatId}
              onClick={() => onChatSelect(chat.id)}
              isDarkMode={isDarkMode}
              onPin={onPin}
              onRename={onRename}
              onAddTag={onAddTag}
              onRemoveTag={onRemoveTag}
              onDownload={onDownload}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}