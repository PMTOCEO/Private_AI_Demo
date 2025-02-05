import { Session, AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import { User } from '@auth0/auth0-react';

// Error Types
export type AuthErrorType = 
  | 'token_refresh_failed'
  | 'session_expired'
  | 'initialization_failed'
  | 'logout_failed'
  | 'invalid_token'
  | 'network_error';

export interface AuthError {
  name: string;
  type: AuthErrorType;
  message: string;
  code: string;
  description: string;
  stack?: string;
  originalError?: Error | SupabaseAuthError;
  timestamp: number;
}

// Session Types
export interface AuthSession {
  session: Session | null;
  expiresAt: number | null;
  lastRefreshed: number;
}

// State Types
export interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: AuthError | null;
  session: AuthSession | null;
}

// Action Types
export interface AuthActions {
  refreshSession: () => Promise<void>;
  clearError: () => void;
  logout: () => Promise<void>;
}
