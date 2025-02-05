import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { supabase } from '../services/supabase';
import { createAuthError, logAuthError } from '../utils/errorHandler';
import { isValidSession, createAuthSession, getTimeUntilExpiry } from '../utils/session';
import type { AuthState, AuthActions } from '../types/auth';

const REFRESH_THRESHOLD = 5 * 60; // 5 minutes in seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export function useSupabaseAuth(): [AuthState, AuthActions] {
  const { getAccessTokenSilently, isAuthenticated, isLoading: isAuth0Loading, logout: auth0Logout } = useAuth0();
  const [state, setState] = useState<AuthState>({
    isInitialized: false,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    session: null
  });

  // Use refs to prevent unnecessary re-renders and race conditions
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const isMountedRef = useRef(true);

  const safeSetState = useCallback((updater: (prev: AuthState) => AuthState) => {
    if (isMountedRef.current) {
      setState(updater);
    }
  }, []);

  const clearTimeouts = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  }, []);

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
        session: createAuthSession(session)
      }));

    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        const delay = RETRY_DELAY * Math.pow(2, retryCount);
        retryTimeoutRef.current = setTimeout(() => refreshSession(retryCount + 1), delay);
        return;
      }

      const authError = createAuthError(
        'token_refresh_failed',
        'Failed to refresh session',
        error as Error
      );
      
      logAuthError(authError);
      
      safeSetState(prev => ({
        ...prev,
        isInitialized: true,
        isLoading: false,
        error: authError,
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
        auth0Logout(),
        supabase.auth.signOut()
      ]);

      safeSetState(prev => ({
        ...prev,
        isAuthenticated: false,
        isLoading: false,
        session: null,
        error: null
      }));
    } catch (error) {
      const authError = createAuthError(
        'logout_failed',
        'Failed to logout properly',
        error as Error
      );
      
      logAuthError(authError);
      
      safeSetState(prev => ({
        ...prev,
        isLoading: false,
        error: authError
      }));
    }
  }, [auth0Logout, clearTimeouts, safeSetState]);

  // Initial session setup
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

  // Auto refresh session
  useEffect(() => {
    if (!state.session?.session) return;

    const timeUntilExpiry = getTimeUntilExpiry(state.session.session);
    if (!timeUntilExpiry) return;

    if (timeUntilExpiry <= REFRESH_THRESHOLD) {
      refreshSession();
      return;
    }

    refreshTimeoutRef.current = setTimeout(() => {
      refreshSession();
    }, (timeUntilExpiry - REFRESH_THRESHOLD) * 1000);

    return () => clearTimeouts();
  }, [state.session, refreshSession, clearTimeouts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      clearTimeouts();
    };
  }, [clearTimeouts]);

  return [
    state,
    { refreshSession, clearError, logout }
  ];
}