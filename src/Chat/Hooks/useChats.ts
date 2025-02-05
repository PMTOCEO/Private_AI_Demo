// Used to Save & Load chats from Supabase database

import { useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { supabase } from '../../Authentication/services/supabase';
import type { Message } from '../Utilities';
import type { Database } from '../../Database/lib/database.types';

type ChatMessage = Database['public']['Tables']['messages']['Row'];

export function useChats() {
  const { user } = useAuth0();
  const [isLoading, setIsLoading] = useState(false);

  const getChats = useCallback(async () => {
    if (!user) return [];

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          messages (
            id,
            content,
            role,
            created_at
          )
        `)
        .eq('user_id', user.sub)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return data.map(chat => ({
        id: chat.id,
        title: chat.title,
        isPinned: chat.pinned,
        messages: (chat.messages as ChatMessage[])?.map(msg => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.created_at).getTime()
        })),
        lastMessage: (chat.messages as ChatMessage[])?.[chat.messages?.length - 1]?.content || '',
        timestamp: new Date(chat.updated_at).getTime(),
        tags: []
      }));
    } catch (error) {
      console.error('Error fetching chats:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const createChat = useCallback(async (title: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chats')
        .insert({
          title,
          user_id: user.sub,
          pinned: false
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating chat:', error);
      return null;
    }
  }, [user]);

  const addMessage = useCallback(async (chatId: string, message: Message) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          content: message.content,
          role: message.role
        })
        .select()
        .single();

      if (error) throw error;

      // Update chat's updated_at timestamp
      await supabase
        .from('chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chatId);

      return data;
    } catch (error) {
      console.error('Error adding message:', error);
      return null;
    }
  }, [user]);

  const updateChat = useCallback(async (chatId: string, updates: { title?: string; pinned?: boolean }) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('chats')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', chatId)
        .eq('user_id', user.sub);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error updating chat:', error);
      return false;
    }
  }, [user]);

  const deleteChat = useCallback(async (chatId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId)
        .eq('user_id', user.sub);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error deleting chat:', error);
      return false;
    }
  }, [user]);

  return {
    getChats,
    createChat,
    addMessage,
    updateChat,
    deleteChat,
    isLoading
  };
}