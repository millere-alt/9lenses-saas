import React, { createContext, useContext, useState, useEffect } from 'react';
import { Auth0Provider, useAuth0 as useAuth0Hook } from '@auth0/auth0-react';
import { authAPI } from '../services/api';
import {
  setTokens,
  getSession,
  setSession,
  clearAllAuthData,
  migrateLegacyTokens,
  getRefreshToken
} from '../services/tokenStorage';

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

  // Initialize from session storage for fast load
  useEffect(() => {
    migrateLegacyTokens();

    const cachedSession = getSession();
    if (cachedSession) {
      setUser(cachedSession.user);
      setOrganization(cachedSession.organization);
      console.log('Loaded user session from cache');
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (auth0.isAuthenticated && auth0.user) {
          // Get access token from Auth0
          const token = await auth0.getAccessTokenSilently();

          // Sync with backend - get or create user in our database
          try {
            const response = await authAPI.syncAuth0({
              email: auth0.user.email,
              auth0Id: auth0.user.sub,
              name: auth0.user.name,
              picture: auth0.user.picture
            });

            const userData = response.data.user;
            const orgData = response.data.organization;

            setUser(userData);
            setOrganization(orgData);

            // Store tokens from backend (access + refresh)
            if (response.data.accessToken && response.data.refreshToken) {
              setTokens(response.data.accessToken, response.data.refreshToken);
            }

            // Store session data for fast access
            setSession({
              user: userData,
              organization: orgData
            });

            console.log('Auth0 user synced with backend successfully');
          } catch (error) {
            console.error('Failed to sync with backend:', error);
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

  const logout = async () => {
    // Revoke refresh token on backend
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await authAPI.logout(refreshToken);
      } catch (error) {
        console.error('Failed to revoke refresh token:', error);
        // Continue with logout even if backend call fails
      }
    }

    // Clear all local auth data
    clearAllAuthData();
    setUser(null);
    setOrganization(null);

    // Logout from Auth0 (for Auth0 users)
    if (auth0.isAuthenticated) {
      auth0.logout({
        returnTo: window.location.origin
      });
    } else {
      // For email/password users, just redirect to home
      window.location.href = '/';
    }
  };

  // Email/password login (bypasses Auth0)
  const loginWithEmail = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });

      const userData = response.data.user;
      const orgData = response.data.organization;

      setUser(userData);
      setOrganization(orgData);

      // Store tokens
      if (response.data.accessToken && response.data.refreshToken) {
        setTokens(response.data.accessToken, response.data.refreshToken);
      }

      // Store session data
      setSession({
        user: userData,
        organization: orgData
      });

      console.log('Email/password login successful');
      return response.data;
    } catch (error) {
      console.error('Email/password login failed:', error);
      throw error;
    }
  };

  // Email/password registration (bypasses Auth0)
  const registerWithEmail = async (email, password, firstName, lastName, organizationName) => {
    try {
      const response = await authAPI.register({
        email,
        password,
        firstName,
        lastName,
        organizationName
      });

      const userData = response.data.user;
      const orgData = response.data.organization;

      setUser(userData);
      setOrganization(orgData);

      // Store tokens
      if (response.data.accessToken && response.data.refreshToken) {
        setTokens(response.data.accessToken, response.data.refreshToken);
      }

      // Store session data
      setSession({
        user: userData,
        organization: orgData
      });

      console.log('Email/password registration successful');
      return response.data;
    } catch (error) {
      console.error('Email/password registration failed:', error);
      throw error;
    }
  };

  const value = {
    ...auth0,
    user,
    organization,
    login,
    signup,
    logout,
    loginWithEmail,
    registerWithEmail,
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
