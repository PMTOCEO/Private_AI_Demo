import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { AuthProvider } from './Authentication/context/AuthContext';
import { hathrService } from './Chat/Services/HathrService';
import App from './App.tsx';
import './index.css';

// Initialize Hathr before rendering
hathrService.initialize().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: 'openid profile email offline_access'
        }}
        useRefreshTokens={true}
        cacheLocation="localstorage"
      >
        <AuthProvider>
          <App />
        </AuthProvider>
      </Auth0Provider>
    </StrictMode>
  );
}).catch(error => {
  console.error('Failed to initialize application:', error);
});