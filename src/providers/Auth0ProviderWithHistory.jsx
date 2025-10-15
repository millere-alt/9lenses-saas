import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { auth0Config } from '../config/auth0Config';

/**
 * Auth0 Provider wrapper that handles authentication redirects
 * and provides Auth0 context to the entire application
 */
export const Auth0ProviderWithHistory = ({ children }) => {
  const onRedirectCallback = (appState) => {
    // Navigate to the returnTo path or default to home
    window.history.replaceState(
      {},
      document.title,
      appState?.returnTo || window.location.pathname
    );
  };

  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        ...auth0Config.authorizationParams,
        redirect_uri: window.location.origin
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation={auth0Config.cacheLocation}
      useRefreshTokens={auth0Config.useRefreshTokens}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
