import { API_CONFIG } from './config';
import type { TokenResponse } from '../Utilities/types';

class HathrService {
  private static instance: HathrService;
  private token: string | null = null;
  private tokenExpiry: number | null = null;

  private constructor() {}

  static getInstance(): HathrService {
    if (!HathrService.instance) {
      HathrService.instance = new HathrService();
    }
    return HathrService.instance;
  }

  async initialize(): Promise<void> {
    if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return; // Token still valid
    }

    try {
      const tokenResponse = await this.getAuthToken();
      this.token = tokenResponse.access_token;
      this.tokenExpiry = Date.now() + (tokenResponse.expires_in * 1000);
    } catch (error) {
      console.error('Hathr initialization failed:', error);
      throw error;
    }
  }

  private async getAuthToken(): Promise<TokenResponse> {
    const tokenUrl = `https://${API_CONFIG.authDomain}/oauth2/token`;
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: API_CONFIG.clientId,
      client_secret: API_CONFIG.clientSecret,
      scope: 'hathr/llm'
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    if (!response.ok) {
      throw new Error(`Auth failed: ${response.status}`);
    }

    return response.json();
  }

  getToken(): string | null {
    return this.token;
  }
}

export const hathrService = HathrService.getInstance();
