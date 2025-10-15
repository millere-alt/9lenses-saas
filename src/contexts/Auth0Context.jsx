import React, { createContext, useContext, useState, useEffect } from 'react';
import { Auth0Provider, useAuth0 as useAuth0Hook } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Auth0Context = createContext(null);

export const useAuth0Extended = () => {
  const context = useContext(Auth0Context);
  if (!context) {
    throw new Error('useAuth0Extended must be used within an Auth0ExtendedProvider');
  }
  return context;
};

/**
 * Auth0 Extended Provider - wraps Auth0 with custom logic
 */
export const Auth0ExtendedProvider = ({ children }) => {
  const auth0 = useAuth0Hook();
  const [user, setUser] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (auth0.isAuthenticated && auth0.user) {
          // Get access token from Auth0
          const token = await auth0.getAccessTokenSilently();

          // Store token
          localStorage.setItem('token', token);

          // Sync with backend - get or create user in our database
          try {
            const response = await authAPI.login({
              email: auth0.user.email,
              auth0Id: auth0.user.sub,
              name: auth0.user.name,
              picture: auth0.user.picture
            });

            setUser(response.data.user);
            setOrganization(response.data.organization);
          } catch (error) {
            // If user doesn't exist in our DB, create them
            if (error.status === 404 || error.status === 401) {
              const response = await authAPI.register({
                email: auth0.user.email,
                auth0Id: auth0.user.sub,
                firstName: auth0.user.given_name || auth0.user.name?.split(' ')[0] || '',
                lastName: auth0.user.family_name || auth0.user.name?.split(' ').slice(1).join(' ') || '',
                organizationName: auth0.user.email?.split('@')[1]?.split('.')[0] || 'My Organization',
                picture: auth0.user.picture
              });

              setUser(response.data.user);
              setOrganization(response.data.organization);
            } else {
              console.error('Failed to sync with backend:', error);
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!auth0.isLoading) {
      initializeAuth();
    }
  }, [auth0.isAuthenticated, auth0.isLoading, auth0.user]);

  const login = async (options) => {
    await auth0.loginWithRedirect(options);
  };

  const signup = async (options) => {
    await auth0.loginWithRedirect({
      ...options,
      screen_hint: 'signup'
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('9lenses_user');
    setUser(null);
    setOrganization(null);
    auth0.logout({
      returnTo: window.location.origin
    });
  };

  const value = {
    ...auth0,
    user,
    organization,
    login,
    signup,
    logout,
    loading: auth0.isLoading || loading,
    isAuthenticated: auth0.isAuthenticated && !!user
  };

  return <Auth0Context.Provider value={value}>{children}</Auth0Context.Provider>;
};

/**
 * Root Auth0 Provider - sets up Auth0
 */
export const Auth0ProviderWithConfig = ({ children }) => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  if (!domain || !clientId) {
    console.error('Auth0 configuration missing. Please set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID in your .env file');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Configuration Error</h1>
          <p className="text-gray-600">Auth0 credentials are not configured.</p>
          <p className="text-sm text-gray-500 mt-2">Please check your .env file.</p>
        </div>
      </div>
    );
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
        scope: 'openid profile email'
      }}
      cacheLocation="localstorage"
    >
      <Auth0ExtendedProvider>
        {children}
      </Auth0ExtendedProvider>
    </Auth0Provider>
  );
};
