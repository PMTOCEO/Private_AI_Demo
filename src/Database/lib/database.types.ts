export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          last_login: string | null;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
          last_login?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          last_login?: string | null;
        };
      };
      files: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          size: number;
          mime_type: string;
          storage_path: string;
          public_url: string;
          user_id: string;
          shared: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          size: number;
          mime_type: string;
          storage_path: string;
          public_url: string;
          user_id: string;
          shared?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          size?: number;
          mime_type?: string;
          storage_path?: string;
          public_url?: string;
          user_id?: string;
          shared?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      chats: {
        Row: {
          id: string;
          title: string;
          user_id: string;
          pinned: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          user_id: string;
          pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          user_id?: string;
          pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          chat_id: string;
          content: string;
          role: 'user' | 'assistant';
          created_at: string;
        };
        Insert: {
          id?: string;
          chat_id: string;
          content: string;
          role: 'user' | 'assistant';
          created_at?: string;
        };
        Update: {
          id?: string;
          chat_id?: string;
          content?: string;
          role?: 'user' | 'assistant';
          created_at?: string;
        };
      };
    };
  };
}