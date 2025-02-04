import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { supabase } from '../../Database/lib/supabase';

export function useSupabaseAuth() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  useEffect(() => {
    const setupSupabaseSession = async () => {
      if (!isAuthenticated || !user) {
        console.log('Waiting for Auth0 authentication...');
        return;
      }

      try {
        console.log('Setting up Supabase session for user:', user.sub);
        
        // Get JWT token from Auth0 with the correct audience and scope
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: `${import.meta.env.VITE_SUPABASE_URL}/auth/v1`,
            scope: 'openid profile email'
          }
        });
        
        console.log('Received Auth0 token');

        // Set Supabase auth session
        const { data: { session }, error } = await supabase.auth.setSession({
          access_token: token,
          refresh_token: token // For Auth0, we can use the same token
        });

        if (error) {
          console.error('Supabase session error:', error);
          throw error;
        }

        console.log('Supabase session established:', {
          sessionExists: !!session,
          user: session?.user?.id
        });

        setIsSupabaseConnected(true);

      } catch (error) {
        console.error('Error setting up Supabase session:', {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        setIsSupabaseConnected(false);
      }
    };

    setupSupabaseSession();
  }, [user, isAuthenticated, getAccessTokenSilently]);

  return { isAuthenticated, isSupabaseConnected };
}