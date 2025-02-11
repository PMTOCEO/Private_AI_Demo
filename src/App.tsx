import { useState, useEffect, useRef, useCallback } from 'react';
import { Message, Chat } from './Chat/Utilities';
import { ChatMessage } from './Chat/ChatInterface/ChatMessage.tsx';
import { generateKey} from './Chat/Utilities/encryption';
import { ChatInput } from './Chat/ChatInterface/ChatInput';
import { Header } from './User_Interface/Header/Header';
import { Sidebar } from './User_Interface/Sidebar/MainSidebar';
import { ChatTitle } from './Chat/ChatInterface/ChatTitle';
import { SavedToClipboardMessagePopup } from './Chat/ChatInterface/SavedToClipboardMessagePopup';
import { Settings } from './User_Interface/Sidebar/Settings';
import { SaveModal } from './User_Interface/Header/SaveModal';
import { AddTimeModal } from './User_Interface/Header/AddTimeModal';
import { DownloadModal } from './User_Interface/Header/DownloadModal';
import { DeleteModal } from './User_Interface/Header/DeleteModal';
import { FileManagerModal } from './File_Manager/FileManagerModal';
import { getHathrAuthToken } from './Chat/Services/auth';
import { sendChatRequest } from './Chat/Services/chat';
import type { ChatMessage as APIChatMessage } from './Chat/Utilities/types';
import { richTextToPlain } from './Chat/Utilities/richTextConversion';

const MAX_CONVERSATION_HISTORY = 5;

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [expirationTime, setExpirationTime] = useState(Date.now() + 30 * 60 * 1000);
  const [showSavedToClipboardMessagePopup, setShowSavedToClipboardMessagePopup] = useState(false);
  const [SavedToClipboardMessagePopupMessage, setSavedToClipboardMessagePopupMessage] = useState('');
  const [chatTitle, setChatTitle] = useState('New Chat');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [recentChats, setRecentChats] = useState<Chat[]>([]);
  const [pinnedChats, setPinnedChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>();
  const [selectedTag, setSelectedTag] = useState<string | undefined>();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isAddTimeModalOpen, setIsAddTimeModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  useEffect(() => {
    const initializeEncryption = async () => {
      const key = await generateKey();
      setEncryptionKey(key);
    };
    initializeEncryption();
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const tokenResponse = await getHathrAuthToken();
        setAuthToken(tokenResponse.access_token);
      } catch (error) {
        console.error('Auth initialization failed:', error);
      }
    };
    initializeAuth();
  }, []);

  const scrollToBottom = useCallback(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [shouldAutoScroll]);

  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
    setShouldAutoScroll(isNearBottom);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
      return () => chatContainer.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const getRecentConversationHistory = (messages: Message[]): APIChatMessage[] => {
    return messages.slice(-MAX_CONVERSATION_HISTORY).map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      text: msg.content
    }));
  };

  const handleDelete = () => {
    if (selectedChatId) {
      setRecentChats(prev => prev.filter(chat => chat.id !== selectedChatId));
      setPinnedChats(prev => prev.filter(chat => chat.id !== selectedChatId));
      setMessages([]);
      setChatTitle('New Chat');
      setSelectedChatId(undefined);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!encryptionKey || !authToken) {
      console.error('Cannot send message:', {
        hasEncryptionKey: !!encryptionKey,
        hasAuthToken: !!authToken
      });
      return;
    }

    const newMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const messageHistory = getRecentConversationHistory([...messages, newMessage]);
      // Convert rich text to plain text for API
      const plainTextMessages = messageHistory.map(msg => ({
        ...msg,
        text: richTextToPlain(msg.text)
      }));
      
      const response = await sendChatRequest(authToken, plainTextMessages);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.data.message,
        timestamp: Date.now(),
        isNew: true
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (selectedChatId) {
        const updateChat = (chats: Chat[]) => chats.map(chat => 
          chat.id === selectedChatId 
            ? { ...chat, lastMessage: content, messages: [...chat.messages || [], newMessage, assistantMessage] }
            : chat
        );

        setRecentChats(prev => updateChat(prev));
        setPinnedChats(prev => updateChat(prev));
      } else {
        const newChat: Chat = {
          id: crypto.randomUUID(),
          title: chatTitle,
          lastMessage: content,
          messages: [newMessage, assistantMessage],
          timestamp: Date.now(),
          createdAt: Date.now(),
          expiresAt: expirationTime,
          tags: [],
          isPinned: false
        };
        setRecentChats(prev => [newChat, ...prev]);
        setSelectedChatId(newChat.id);
      }
    } catch (error) {
      console.error('Message processing failed:', error);
      
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your message. Please try again.',
        timestamp: Date.now(),
        isNew: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async (messageId: string) => {
    if (!encryptionKey || !authToken) return;
    setIsLoading(true);

    try {
      const messageIndex = messages.findIndex(m => m.id === messageId);
      const messageHistory = getRecentConversationHistory(messages.slice(0, messageIndex + 1));
      const response = await sendChatRequest(authToken, messageHistory);

      const regeneratedMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.data.message,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, regeneratedMessage]);

      if (selectedChatId) {
        const updateChat = (chats: Chat[]) => chats.map(chat => 
          chat.id === selectedChatId 
            ? { ...chat, messages: [...(chat.messages || []), regeneratedMessage] }
            : chat
        );

        setRecentChats(prev => updateChat(prev));
        setPinnedChats(prev => updateChat(prev));
      }
    } catch (error) {
      console.error('Error regenerating response:', error);
      
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I encountered an error regenerating the response. Please try again.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setChatTitle('New Chat');
    setSelectedChatId(undefined);
    setSelectedTag(undefined);
  };

  const handleChatSelect = (chatId: string) => {
    const chat = [...pinnedChats, ...recentChats].find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages || []);
      setChatTitle(chat.title);
      setSelectedChatId(chatId);
    }
  };

  const handlePin = (chatId: string) => {
    const chat = [...pinnedChats, ...recentChats].find(c => c.id === chatId);
    if (!chat) return;

    if (chat.isPinned) {
      setPinnedChats(prev => prev.filter(c => c.id !== chatId));
      setRecentChats(prev => [...prev, { ...chat, isPinned: false }]);
    } else {
      setRecentChats(prev => prev.filter(c => c.id !== chatId));
      setPinnedChats(prev => [...prev, { ...chat, isPinned: true }]);
    }
  };

  const handleRename = (chatId: string, newTitle: string) => {
    const updateTitle = (chats: Chat[]) => chats.map(chat =>
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    );

    setRecentChats(prev => updateTitle(prev));
    setPinnedChats(prev => updateTitle(prev));

    if (chatId === selectedChatId) {
      setChatTitle(newTitle);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setChatTitle(newTitle);
    if (selectedChatId) {
      handleRename(selectedChatId, newTitle);
    }
  };

  const handleAddTag = (chatId: string, tag: string) => {
    const updateTags = (chats: Chat[]) => chats.map(chat =>
      chat.id === chatId 
        ? { ...chat, tags: [...(chat.tags || []), tag] }
        : chat
    );

    setRecentChats(prev => updateTags(prev));
    setPinnedChats(prev => updateTags(prev));
  };

  const handleRemoveTag = (chatId: string, tagToRemove: string) => {
    const updateTags = (chats: Chat[]) => chats.map(chat =>
      chat.id === chatId 
        ? { ...chat, tags: (chat.tags || []).filter(tag => tag !== tagToRemove) }
        : chat
    );

    setRecentChats(prev => updateTags(prev));
    setPinnedChats(prev => updateTags(prev));
  };

  const handleDownload = (format: 'json' | 'txt' | 'pdf') => {
    const chat = {
      title: chatTitle,
      messages,
      createdAt: Date.now(),
      expiresAt: expirationTime,
    };

    switch (format) {
      case 'json': {
        const blob = new Blob([JSON.stringify(chat, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        break;
      }
      case 'txt': {
        const text = messages
          .map(m => `${m.role === 'user' ? 'You' : 'Assistant'}: ${m.content}`)
          .join('\n\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        break;
      }
      case 'pdf': {
        break;
      }
    }
  };

  const filteredRecentChats = selectedTag
    ? recentChats.filter(chat => chat.tags?.includes(selectedTag))
    : recentChats;

  const filteredPinnedChats = selectedTag
    ? pinnedChats.filter(chat => chat.tags?.includes(selectedTag))
    : pinnedChats;

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <SavedToClipboardMessagePopup 
        show={showSavedToClipboardMessagePopup} 
        message={SavedToClipboardMessagePopupMessage} 
        isDarkMode={isDarkMode} 
      />
      
      <Sidebar 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isDarkMode={isDarkMode}
        onDarkModeToggle={() => setIsDarkMode(!isDarkMode)}
        onNewChat={handleNewChat}
        recentChats={filteredRecentChats}
        pinnedChats={filteredPinnedChats}
        selectedChatId={selectedChatId}
        onChatSelect={handleChatSelect}
        onPin={handlePin}
        onRename={handleRename}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
        onDownload={handleDownload}
        onDelete={(id) => {
          setSelectedChatId(id);
          setIsDeleteModalOpen(true);
        }}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      
      <div className="flex flex-1 flex-col h-screen overflow-hidden">
        <Header
          onDownload={() => setIsDownloadModalOpen(true)}
          onDelete={() => setIsDeleteModalOpen(true)}
          expirationTime={expirationTime}
          onAddHour={() => setIsAddTimeModalOpen(true)}
          isDarkMode={isDarkMode}
          onFiles={() => setIsFileManagerOpen(true)}
        />
        
        <ChatTitle
          title={chatTitle}
          onTitleChange={handleTitleChange}
          isDarkMode={isDarkMode}
          isEditing={isEditingTitle}
          onEditStart={() => setIsEditingTitle(true)}
          onEditEnd={() => setIsEditingTitle(false)}
        />
        
        <div className="flex-1 flex flex-col min-h-0">
          {messages.length === 0 ? (
            <div className={`flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
              <div className="relative">
                <img 
                  src={isDarkMode 
                    ? "https://43605540.fs1.hubspotusercontent-na1.net/hubfs/43605540/PENTOS/Logos/Web%20Optimized/Emblem%20Only/Pentos%20Emblem%20(White).png" 
                    : "https://43605540.fs1.hubspotusercontent-na1.net/hubfs/43605540/PENTOS/Logos/Web%20Optimized/Emblem%20Only/Pentos%20Emblem%20(Black).png"} 
                  alt="Pentos Logo" 
                  className="relative h-16 w-16 object-contain"
                />
              </div>
              <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                Welcome to Pentos
              </h1>
              <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>
                <span>End-to-End Encrypted</span>
              </div>
            </div>
          ) : (
            <div 
              ref={chatContainerRef}
              className={`flex-1 overflow-y-auto p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
            >
              <div className="mx-auto max-w-4xl space-y-4">
                {messages.map((message) => (
                  <ChatMessage 
                    key={message.id} 
                    message={message}
                    isDarkMode={isDarkMode}
                    onEdit={(id, newContent) => {
                      setMessages(prev => prev.map(msg =>
                        msg.id === id ? { ...msg, content: newContent } : msg
                      ));
                    }}
                    onDelete={(id) => {
                      setMessages(prev => prev.filter(msg => msg.id !== id));
                    }}
                    onCopy={() => {
                      setSavedToClipboardMessagePopupMessage('Message copied to clipboard');
                      setShowSavedToClipboardMessagePopup(true);
                      setTimeout(() => setShowSavedToClipboardMessagePopup(false), 3000);
                    }}
                    onSend={handleSendMessage}
                    onRegenerate={handleRegenerate}
                  />
                ))}
                {isLoading && (
                  <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    <div className="animate-pulse">●</div>
                    <div className="animate-pulse animation-delay-200">●</div>
                    <div className="animate-pulse animation-delay-400">●</div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          <div className={`border-t ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'} p-4`}>
            <div className="mx-auto max-w-4xl">
              <ChatInput 
                onSend={handleSendMessage} 
                disabled={isLoading || !encryptionKey || !authToken}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        </div>
      </div>

      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDarkMode={isDarkMode}
        onDarkModeToggle={() => setIsDarkMode(!isDarkMode)}
      />

      <SaveModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        isDarkMode={isDarkMode}
      />

      <AddTimeModal
        isOpen={isAddTimeModalOpen}
        onClose={() => setIsAddTimeModalOpen(false)}
        isDarkMode={isDarkMode}
        onConfirm={() => {
          setExpirationTime(prev => prev + 30 * 60 * 1000);
          setIsAddTimeModalOpen(false);
        }}
      />

      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        isDarkMode={isDarkMode}
        onDownload={handleDownload}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isDarkMode={isDarkMode}
      />

      <FileManagerModal
        isOpen={isFileManagerOpen}
        onClose={() => setIsFileManagerOpen(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

export default App;