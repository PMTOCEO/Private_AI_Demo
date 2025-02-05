import { API_CONFIG } from './config';
import type { ChatMessage, ChatRequest, ChatResponse } from '../Utilities/types';

export async function sendChatRequest(token: string, messages: ChatMessage[]): Promise<ChatResponse> {
  try {
    const response = await fetch(`${API_CONFIG.apiBase}/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: messages.map(msg => ({
          role: msg.role,
          text: msg.text
        })),
        temperature: 0.2,
        topP: 1.0
      } as ChatRequest)
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(`Chat request failed: ${response.status}`);
    }

    // The API returns { code: 200, message: "Success", response: { message: "..." } }
    if (responseData.code === 200 && responseData.response?.message) {
      return {
        status: responseData.code,
        message: responseData.message,
        data: {
          usage: {},
          message: responseData.response.message
        }
      };
    }

    throw new Error('Invalid API response structure');
  } catch (error) {
    console.error('Chat request error details:', error);
    throw error;
  }
}