export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  temperature?: number;
  topP?: number;
}

export interface ChatResponse {
  status: number;
  message: string;
  data: {
    usage: {
      [key: string]: number;
    };
    message: string;
  };
}

export interface UploadResponse {
  status: number;
  message: string;
  response: {
    signedUrl: string;
    fileKey: string;
  };
}

export interface DocumentResponse {
  code: number;
  message: string;
  response: {
    documents?: Array<{
      name: string;
      [key: string]: unknown;
    }>;
    [key: string]: unknown;
  };
}