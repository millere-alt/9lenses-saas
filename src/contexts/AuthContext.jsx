import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await userAPI.getMe();
          setUser(response.data.user);
          setOrganization(response.data.organization);
        } catch (error) {
          console.error('Auth check failed:', error);
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('9lenses_user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { user, organization, token } = response.data;

      // Store token
      localStorage.setItem('token', token);
      localStorage.setItem('9lenses_user', JSON.stringify(user));

      setUser(user);
      setOrganization(organization);

      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error(error.message || 'Login failed');
    }
  };

  const signup = async (name, email, password, company) => {
    try {
      // Parse full name into first and last name
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const response = await authAPI.register({
        email,
        password,
        firstName,
        lastName,
        organizationName: company
      });

      const { user, organization, token } = response.data;

      // Store token
      localStorage.setItem('token', token);
      localStorage.setItem('9lenses_user', JSON.stringify(user));

      setUser(user);
      setOrganization(organization);

      return user;
    } catch (error) {
      console.error('Signup failed:', error);
      throw new Error(error.message || 'Signup failed');
    }
  };

  const logout = () => {
    setUser(null);
    setOrganization(null);
    localStorage.removeItem('token');
    localStorage.removeItem('9lenses_user');
  };

  const value = {
    user,
    organization,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
