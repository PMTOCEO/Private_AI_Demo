import { API_CONFIG } from './config';
import type { TokenResponse } from '../Utilities/types';

export async function getHathrAuthToken(): Promise<TokenResponse> {
  const tokenUrl = `https://${API_CONFIG.authDomain}/oauth2/token`;
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: API_CONFIG.clientId,
    client_secret: API_CONFIG.clientSecret,
    scope: 'hathr/llm'
  });

  try {
    console.log('Requesting auth token...');
    console.log('Auth URL:', tokenUrl);
    console.log('Client ID:', API_CONFIG.clientId);
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const responseData = await response.text();
    console.log('Auth Response Status:', response.status);
    console.log('Auth Response Headers:', Object.fromEntries(response.headers));
    console.log('Auth Response Body:', responseData);

    if (!response.ok) {
      throw new Error(`Auth failed: ${response.status} - ${responseData}`);
    }

    return JSON.parse(responseData);
  } catch (error) {
    console.error('Authentication error details:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}