// Used for local state management for active chat

import { useState, useEffect } from 'react';
import { Message, Chat } from '../Utilities';
import { generateKey, encryptData } from '../Utilities/encryption';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);
  const [chatTitle, setChatTitle] = useState('New Chat');
  const [expirationTime, setExpirationTime] = useState(Date.now() + 60 * 60 * 1000);
  const [recentChats, setRecentChats] = useState<Chat[]>([]);
  const [savedChats, setSavedChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>();

  useEffect(() => {
    const initializeEncryption = async () => {
      const key = await generateKey();
      setEncryptionKey(key);
    };
    initializeEncryption();
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!encryptionKey) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      await encryptData(content, encryptionKey);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const sataMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'This is a simulated response. Connect to a real API for actual AI responses.',
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, sataMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    if (messages.length > 0) {
      const newChat: Chat = {
        id: crypto.randomUUID(),
        title: chatTitle,
        messages,
        createdAt: Date.now(),
        expiresAt: expirationTime,
        tags: [],
        isPinned: false,
        lastMessage: messages[messages.length - 1]?.content || '',
        timestamp: Date.now(),
      };
      setRecentChats(prev => [newChat, ...prev]);
    }
    setMessages([]);
    setChatTitle('New Chat');
    setExpirationTime(Date.now() + 60 * 60 * 1000);
    setSelectedChatId(undefined);
  };

  const handleChatSelect = (chatId: string) => {
    const chat = [...recentChats, ...savedChats].find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages || []);
      setChatTitle(chat.title);
      setExpirationTime(chat.expiresAt);
      setSelectedChatId(chatId);
    }
  };

  return {
    messages,
    isLoading,
    encryptionKey,
    chatTitle,
    setChatTitle,
    expirationTime,
    setExpirationTime,
    recentChats,
    setRecentChats,
    savedChats,
    setSavedChats,
    selectedChatId,
    handleSendMessage,
    handleNewChat,
    handleChatSelect,
  };
}