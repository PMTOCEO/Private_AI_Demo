import { createContext, useContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { supabase, setSupabaseToken, clearSupabaseToken } from '../../Database/services/supabase';
import { generateUserUuid } from '../utils/authUUID';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  userUuid: string | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { 
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently
  } = useAuth0();

  const [userUuid, setUserUuid] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  const initializeAuth = useCallback(async () => {
    if (!isAuthenticated || !user?.sub) {
      setUserUuid(null);
      clearSupabaseToken();
      setAuthInitialized(true);
      return;
    }

    try {
      // Generate UUID first
      const uuid = await generateUserUuid(user.sub);
      setUserUuid(uuid);

      // Get Auth0 token
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: 'openid profile email'
        }
      });

      // Set Supabase token
      await setSupabaseToken(token);

      // Create/update user with service role
      const { error } = await supabase.auth.admin.createUser({
        email: user.email,
        email_confirm: true,
        user_metadata: {
          name: user.name,
          auth0_id: user.sub,
          uuid: uuid
        }
      });

      if (error && error.message !== 'User already registered') {
        throw error;
      }

      // Update user metadata
      await supabase
        .from('users')
        .upsert({
          id: uuid,
          email: user.email,
          name: user.name,
          auth0_id: user.sub,
          last_login: new Date().toISOString()
        })
        .match({ id: uuid });

    } catch (error) {
      console.error('Auth initialization error:', error);
      setUserUuid(null);
      clearSupabaseToken();
    } finally {
      setAuthInitialized(true);
    }
  }, [isAuthenticated, user, getAccessTokenSilently]);

  useEffect(() => {
    if (!authInitialized) {
      initializeAuth();
    }
  }, [authInitialized, initializeAuth]);

  const logout = useCallback(async () => {
    setUserUuid(null);
    clearSupabaseToken();
    await auth0Logout({ logoutParams: { returnTo: window.location.origin } });
  }, [auth0Logout]);

  if (!authInitialized) {
    return null; // Or a loading spinner
  }

  const value = {
    isAuthenticated,
    isLoading,
    user,
    userUuid,
    login: loginWithRedirect,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}