import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

export const AuthProvider = ({ children }) => {
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
  const redirectUri = window.location.origin;

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        ui_locales: 'en',
        prompt: 'login',
        scope: 'openid profile email'  // Added scope to get email info
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
};