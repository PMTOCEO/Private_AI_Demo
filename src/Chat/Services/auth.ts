import { API_CONFIG } from './config';
import type { TokenResponse } from '../Utilities/types';

let authPromise: Promise<TokenResponse> | null = null;

export async function getHathrAuthToken(): Promise<TokenResponse> {
  // Return existing promise if authentication is in progress
  if (authPromise) {
    return authPromise;
  }

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
    
    // Create new auth promise
    authPromise = fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })
    .then(async response => {
      const responseData = await response.text();
      console.log('Auth Response Status:', response.status);
      console.log('Auth Response Headers:', Object.fromEntries(response.headers));
      console.log('Auth Response Body:', responseData);

      if (!response.ok) {
        throw new Error(`Auth failed: ${response.status} - ${responseData}`);
      }

      return JSON.parse(responseData);
    })
    .finally(() => {
      // Clear promise after completion
      authPromise = null;
    });

    return authPromise;
  } catch (error) {
    console.error('Authentication error details:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    // Clear promise on error
    authPromise = null;
    throw error;
  }
}