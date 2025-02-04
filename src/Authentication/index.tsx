import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from '../App';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

root.render(
  <Auth0Provider
    domain="auth.pentos.ai"
    clientId="eQ1w74NZd0IVP5XAiAp2MjARfb4vEqSR"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: `${import.meta.env.VITE_SUPABASE_URL}/auth/v1`,
      scope: 'openid profile email'
    }}
  >
    <App />
  </Auth0Provider>
);