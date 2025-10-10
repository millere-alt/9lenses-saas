import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('9Vectors_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check against demo credentials or stored users
        const storedUsers = JSON.parse(localStorage.getItem('9Vectors_users') || '[]');
        const foundUser = storedUsers.find(u => u.email === email && u.password === password);

        if (foundUser || (email === 'demo@9Vectors.com' && password === 'demo123')) {
          const userData = foundUser || {
            id: '1',
            email: 'demo@9Vectors.com',
            name: 'Demo User',
            role: 'admin',
            company: 'Demo Company',
            createdAt: new Date().toISOString()
          };

          setUser(userData);
          localStorage.setItem('9Vectors_user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 800);
    });
  };

  const signup = async (name, email, password, company) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const storedUsers = JSON.parse(localStorage.getItem('9Vectors_users') || '[]');

        // Check if user already exists
        if (storedUsers.find(u => u.email === email)) {
          reject(new Error('User already exists with this email'));
          return;
        }

        const newUser = {
          id: Date.now().toString(),
          email,
          password,
          name,
          company,
          role: 'user',
          createdAt: new Date().toISOString()
        };

        storedUsers.push(newUser);
        localStorage.setItem('9Vectors_users', JSON.stringify(storedUsers));

        const { password: _, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        localStorage.setItem('9Vectors_user', JSON.stringify(userWithoutPassword));

        resolve(userWithoutPassword);
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('9Vectors_user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
