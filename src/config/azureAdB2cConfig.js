// Azure AD Configuration (using regular Azure AD for now, can upgrade to B2C later)
export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_AD_B2C_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_AD_B2C_TENANT_NAME}.onmicrosoft.com`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};

// Scopes for ID token
export const loginRequest = {
  scopes: ['openid', 'profile', 'offline_access'],
};

// Scopes for accessing APIs
export const tokenRequest = {
  scopes: [
    `https://${import.meta.env.VITE_AZURE_AD_B2C_TENANT_NAME}.onmicrosoft.com/${import.meta.env.VITE_AZURE_AD_B2C_CLIENT_ID}/access_as_user`
  ],
};

// Policy names (not used for regular Azure AD, but kept for compatibility)
export const b2cPolicies = {
  names: {
    signUpSignIn: 'signupsignin',
    forgotPassword: 'passwordreset',
    editProfile: 'profileedit',
  },
  authorities: {
    signUpSignIn: {
      authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_AD_B2C_TENANT_NAME}.onmicrosoft.com`,
    },
    forgotPassword: {
      authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_AD_B2C_TENANT_NAME}.onmicrosoft.com`,
    },
    editProfile: {
      authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_AD_B2C_TENANT_NAME}.onmicrosoft.com`,
    },
  },
};
