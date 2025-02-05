import { useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { supabase } from '../../Authentication/services/supabase';

export function useTags() {
  const { user } = useAuth0();

  const getTags = useCallback(async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('user_id', user.sub)
        .order('name');

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  }, [user]);

  const createTag = useCallback(async (name: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('tags')
        .insert({
          name,
          user_id: user.sub
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating tag:', error);
      return null;
    }
  }, [user]);

  const addTagToChat = useCallback(async (chatId: string, tagId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('chat_tags')
        .insert({
          chat_id: chatId,
          tag_id: tagId
        });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error adding tag to chat:', error);
      return false;
    }
  }, [user]);

  const removeTagFromChat = useCallback(async (chatId: string, tagId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('chat_tags')
        .delete()
        .eq('chat_id', chatId)
        .eq('tag_id', tagId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error removing tag from chat:', error);
      return false;
    }
  }, [user]);

  return {
    getTags,
    createTag,
    addTagToChat,
    removeTagFromChat
  };
}