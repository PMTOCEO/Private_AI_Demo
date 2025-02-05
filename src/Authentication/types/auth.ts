import { AuthError as SupabaseAuthError, Session } from '@supabase/supabase-js';

export type AuthErrorType = 
  | 'token_refresh_failed'
  | 'session_expired'
  | 'initialization_failed'
  | 'logout_failed'
  | 'invalid_token'
  | 'network_error';

export interface AuthError {
  type: AuthErrorType;
  message: string;
  originalError?: Error | SupabaseAuthError;
  timestamp: number;
}

export interface AuthSession {
  session: Session | null;
  expiresAt: number | null;
  lastRefreshed: number;
}

export interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  session: AuthSession | null;
}

export interface AuthActions {
  refreshSession: () => Promise<void>;
  clearError: () => void;
  logout: () => Promise<void>;
}