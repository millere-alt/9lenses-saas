// Auth0 Configuration for 9Vectors SaaS
export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || 'your-tenant.auth0.com',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || 'your-client-id',
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: import.meta.env.VITE_AUTH0_AUDIENCE || `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/`,
    scope: 'openid profile email'
  },
  cacheLocation: 'localstorage',
  useRefreshTokens: true
};

export default auth0Config;
