// Used to communicate with Hathr API

import { useState, useCallback, useEffect } from 'react';
import { getHathrAuthToken } from '../Services/auth';
import { sendChatRequest } from '../Services/chat';

export function useAIChat() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const tokenResponse = await getHathrAuthToken();
        setToken(tokenResponse.access_token);
      } catch (err) {
        setError('Failed to initialize authentication');
        console.error(err);
      }
    };

    initializeAuth();
  }, []);

  const sendMessage = useCallback(async (content: string): Promise<string | null> => {
    if (!token) {
      setError('Not authenticated');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await sendChatRequest(token, [{
        role: 'user',
        text: content
      }]);

      return response.data.message;
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  return {
    isInitialized: !!token,
    isLoading,
    error,
    sendMessage
  };
}