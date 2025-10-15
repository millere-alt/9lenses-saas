import React, { createContext, useContext, useState, useEffect } from 'react';
import { MsalProvider, useMsal, useIsAuthenticated } from '@azure/msal-react';
import { PublicClientApplication, InteractionStatus } from '@azure/msal-browser';
import { msalConfig, loginRequest, b2cPolicies } from '../config/azureAdB2cConfig';
import { authAPI } from '../services/api';

const AzureAdB2cContext = createContext(null);

export const useAzureAdB2c = () => {
  const context = useContext(AzureAdB2cContext);
  if (!context) {
    throw new Error('useAzureAdB2c must be used within AzureAdB2cProvider');
  }
  return context;
};

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

/**
 * Azure AD B2C Extended Provider - wraps MSAL with custom logic
 */
const AzureAdB2cExtendedProvider = ({ children }) => {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [user, setUser] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (isAuthenticated && accounts[0] && inProgress === InteractionStatus.None) {
          // Get access token
          const response = await instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0],
          });

          const token = response.accessToken;
          localStorage.setItem('token', token);

          // Extract user info from Azure AD B2C
          const azureUser = accounts[0];
          const email = azureUser.username;
          const name = azureUser.name || email;
          const nameParts = name.split(' ');

          // Sync with backend - get or create user in our database
          try {
            const backendResponse = await authAPI.login({
              email,
              azureAdB2cId: azureUser.localAccountId,
              name: azureUser.name,
            });

            setUser(backendResponse.data.user);
            setOrganization(backendResponse.data.organization);
          } catch (error) {
            // If user doesn't exist in our DB, create them
            if (error.status === 404 || error.status === 401) {
              const backendResponse = await authAPI.register({
                email,
                azureAdB2cId: azureUser.localAccountId,
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                organizationName: email.split('@')[1]?.split('.')[0] || 'My Organization',
              });

              setUser(backendResponse.data.user);
              setOrganization(backendResponse.data.organization);
            } else {
              console.error('Failed to sync with backend:', error);
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);

        // Handle password reset flow
        if (error.errorMessage && error.errorMessage.indexOf('AADB2C90118') > -1) {
          try {
            await instance.loginRedirect(b2cPolicies.authorities.forgotPassword);
          } catch (err) {
            console.error(err);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    if (inProgress === InteractionStatus.None) {
      initializeAuth();
    }
  }, [isAuthenticated, accounts, instance, inProgress]);

  const login = async () => {
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const signup = async () => {
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('9lenses_user');
    setUser(null);
    setOrganization(null);
    instance.logoutRedirect({
      postLogoutRedirectUri: window.location.origin,
    });
  };

  const editProfile = async () => {
    try {
      await instance.loginRedirect(b2cPolicies.authorities.editProfile);
    } catch (error) {
      console.error('Edit profile error:', error);
    }
  };

  const resetPassword = async () => {
    try {
      await instance.loginRedirect(b2cPolicies.authorities.forgotPassword);
    } catch (error) {
      console.error('Reset password error:', error);
    }
  };

  const value = {
    user,
    organization,
    login,
    signup,
    logout,
    editProfile,
    resetPassword,
    loading: loading || inProgress !== InteractionStatus.None,
    isAuthenticated: isAuthenticated && !!user,
    accounts,
    instance,
  };

  return <AzureAdB2cContext.Provider value={value}>{children}</AzureAdB2cContext.Provider>;
};

/**
 * Root Azure AD B2C Provider - sets up MSAL
 */
export const AzureAdB2cProvider = ({ children }) => {
  const tenantName = import.meta.env.VITE_AZURE_AD_B2C_TENANT_NAME;
  const clientId = import.meta.env.VITE_AZURE_AD_B2C_CLIENT_ID;

  if (!tenantName || !clientId) {
    console.error('Azure AD B2C configuration missing. Please set environment variables in your .env file');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Configuration Error</h1>
          <p className="text-gray-600">Azure AD B2C credentials are not configured.</p>
          <p className="text-sm text-gray-500 mt-2">Please check your .env file.</p>
        </div>
      </div>
    );
  }

  return (
    <MsalProvider instance={msalInstance}>
      <AzureAdB2cExtendedProvider>
        {children}
      </AzureAdB2cExtendedProvider>
    </MsalProvider>
  );
};

// Export for compatibility with existing useAuth hook
export const useAuth = useAzureAdB2c;
