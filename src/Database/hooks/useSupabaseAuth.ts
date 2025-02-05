import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { supabase } from '../services/supabase';
import type { AuthError, AuthErrorType } from '../../Authentication/types/auth';
import type { Session } from '@supabase/supabase-js';

interface SupabaseAuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  session: Session | null;
}

interface SupabaseAuthActions {
  refreshSession: () => Promise<void>;
  clearError: () => void;
  logout: () => Promise<void>;
}

const REFRESH_THRESHOLD = 5 * 60; // 5 minutes in seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export function useSupabaseAuth(): [SupabaseAuthState, SupabaseAuthActions] {
  const { getAccessTokenSilently, isAuthenticated, isLoading: isAuth0Loading, logout: auth0Logout } = useAuth0();
  const [state, setState] = useState<SupabaseAuthState>({
    isInitialized: false,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    session: null
  });

  const refreshTimeoutRef = useRef<NodeJS.Timeout>();
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const isMountedRef = useRef(true);

  const safeSetState = useCallback((updater: (prev: SupabaseAuthState) => SupabaseAuthState) => {
    if (isMountedRef.current) {
      setState(updater);
    }
  }, []);

  const clearTimeouts = useCallback(() => {
    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
  }, []);

  const createError = (code: string, message: string, originalError?: Error): AuthError => ({
    name: 'AuthError',
    type: code as AuthErrorType, // Add this
    message,
    code,
    description: originalError?.message || message,
    stack: originalError?.stack,
    timestamp: Date.now(), // Add this
    originalError: originalError // Add this
  });
  

  const refreshSession = useCallback(async (retryCount = 0): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      safeSetState(prev => ({ ...prev, isLoading: true }));

      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: `${import.meta.env.VITE_SUPABASE_URL}/auth/v1`,
          scope: 'openid profile email'
        }
      });

      const { data: { session }, error } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: token
      });

      if (error) throw error;

      safeSetState(prev => ({
        ...prev,
        isInitialized: true,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        session
      }));

    } catch (err) {
      if (retryCount < MAX_RETRIES) {
        const delay = RETRY_DELAY * Math.pow(2, retryCount);
        retryTimeoutRef.current = setTimeout(() => refreshSession(retryCount + 1), delay);
        return;
      }

      const error = createError(
        'token_refresh_failed',
        'Failed to refresh session',
        err as Error
      );
      
      console.error('Session refresh failed:', error);
      
      safeSetState(prev => ({
        ...prev,
        isInitialized: true,
        isLoading: false,
        error,
        session: null
      }));
    }
  }, [isAuthenticated, getAccessTokenSilently, safeSetState]);

  const clearError = useCallback(() => {
    safeSetState(prev => ({ ...prev, error: null }));
  }, [safeSetState]);

  const logout = useCallback(async () => {
    clearTimeouts();
    
    try {
      safeSetState(prev => ({ ...prev, isLoading: true }));
      
      await Promise.all([
        auth0Logout({ logoutParams: { returnTo: window.location.origin } }),
        supabase.auth.signOut()
      ]);

      safeSetState(prev => ({
        ...prev,
        isAuthenticated: false,
        isLoading: false,
        session: null,
        error: null
      }));
    } catch (err) {
      const error = createError(
        'logout_failed',
        'Failed to logout properly',
        err as Error
      );
      
      console.error('Logout failed:', error);
      
      safeSetState(prev => ({
        ...prev,
        isLoading: false,
        error
      }));
    }
  }, [auth0Logout, clearTimeouts, safeSetState]);

  useEffect(() => {
    if (!isAuth0Loading && isAuthenticated) {
      refreshSession();
    } else if (!isAuth0Loading) {
      safeSetState(prev => ({
        ...prev,
        isInitialized: true,
        isAuthenticated: false,
        isLoading: false
      }));
    }
  }, [isAuth0Loading, isAuthenticated, refreshSession, safeSetState]);

  useEffect(() => {
    if (!state.session) return;

    const expiresIn = Math.floor((new Date(state.session.expires_at || 0).getTime() - Date.now()) / 1000);
    if (expiresIn <= 0) return;

    if (expiresIn <= REFRESH_THRESHOLD) {
      refreshSession();
      return;
    }

    refreshTimeoutRef.current = setTimeout(() => {
      refreshSession();
    }, (expiresIn - REFRESH_THRESHOLD) * 1000);

    return () => clearTimeouts();
  }, [state.session, refreshSession, clearTimeouts]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      clearTimeouts();
    };
  }, [clearTimeouts]);

  return [state, { refreshSession, clearError, logout }];
}
