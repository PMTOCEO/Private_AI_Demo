import { createContext, useContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { supabase, setSupabaseToken, clearSupabaseToken } from '../../Database/services/supabase';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { 
    isAuthenticated,
    isLoading: auth0Loading,
    user,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently
  } = useAuth0();

  const [isLoading, setIsLoading] = useState(true);

  const initializeAuth = useCallback(async () => {
    if (!isAuthenticated || !user?.sub || auth0Loading) {
      await clearSupabaseToken();
      setIsLoading(false);
      return;
    }

    try {
      // Get Auth0 token which contains the Supabase token
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: 'openid profile email'
        }
      });

      // Decode token to get UUID from Auth0 trigger
      const decoded = jwtDecode(token);
      const uuid = decoded.sub as string;

      // Check if user exists in Supabase
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('id', uuid)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw checkError;
      }

      // If user doesn't exist, create them
      if (!existingUser) {
        const { error: createError } = await supabase
          .from('users')
          .insert({
            id: uuid,
            email: user.email,
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString()
          });

        if (createError) throw createError;
      }

      // Now set the Supabase session with the token from Auth0
      await setSupabaseToken(token);

    } catch (error) {
      console.error('Auth initialization error:', error);
      await clearSupabaseToken();
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, auth0Loading, getAccessTokenSilently]);

  useEffect(() => {
    if (!auth0Loading) {
      initializeAuth();
    }
  }, [auth0Loading, initializeAuth]);

  const logout = useCallback(async () => {
    await clearSupabaseToken();
    await auth0Logout({ logoutParams: { returnTo: window.location.origin } });
  }, [auth0Logout]);

  const value = {
    isAuthenticated,
    isLoading: isLoading || auth0Loading,
    user,
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
