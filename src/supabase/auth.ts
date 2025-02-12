import { Auth0Client } from '@auth0/auth0-spa-js';
import { createClient } from '@supabase/supabase-js';

const auth0 = new Auth0Client({
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: 'http://localhost:4000',
  },
});

export default createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY, {
  accessToken: async () => {
    const tokenResult = await auth0.getTokenSilently();
    return tokenResult;
  }
});
