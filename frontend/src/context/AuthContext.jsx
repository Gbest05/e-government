import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('rmn_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('rmn_token');
      const savedUser = localStorage.getItem('rmn_user');

      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Refresh user profile from backend
          const res = await authService.getMe();
          setUser(res.data.user);
          localStorage.setItem('rmn_user', JSON.stringify(res.data.user));
        } catch (err) {
          console.error('Session expired or invalid:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (emailOrPhone, password) => {
    const res = await authService.login({ email: emailOrPhone, password });
    const { token: newToken, user: newUser } = res.data;
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('rmn_token', newToken);
    localStorage.setItem('rmn_user', JSON.stringify(newUser));
    return newUser;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    const { token: newToken, user: newUser } = res.data;
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('rmn_token', newToken);
    localStorage.setItem('rmn_user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('rmn_token');
    localStorage.removeItem('rmn_user');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('rmn_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff',
    isCitizen: user?.role === 'citizen',
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
