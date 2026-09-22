// Auth Context for SMARTORA
// Synchronizes authentication state with Express + MongoDB backend and local persistence

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { apiService } from '../services/apiService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(authService.getCurrentUser()));

  // Restore live session from MongoDB / Express backend on initial load
  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      try {
        const res = await apiService.getMe();
        if (mounted && res.success && res.user) {
          setCurrentUser(res.user);
          setIsAuthenticated(true);
          authService.setCurrentUser(res.user);
          return;
        }
      } catch (e) {
        console.warn('[AuthContext] Backend session restore fallback to local storage:', e);
      }

      if (mounted) {
        const localUser = authService.getCurrentUser();
        setCurrentUser(localUser);
        setIsAuthenticated(Boolean(localUser));
      }
    };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (userIdOrEmail, password, remember = true) => {
    const res = await authService.login(userIdOrEmail, password, remember);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setIsAuthenticated(true);
    }
    return res;
  };

  const loginDemo = (roleType = 'admin') => {
    const user = authService.loginDemo(roleType);
    setCurrentUser(user);
    setIsAuthenticated(true);
    return user;
  };

  const register = (userData) => {
    return authService.register(userData);
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (data, actorRole = null) => {
    const updated = await authService.updateProfile(data, actorRole);
    if (updated) {
      setCurrentUser(updated);
    }
    return updated;
  };

  const changePassword = async (userId, oldPassword, newPassword) => {
    const res = await authService.changePassword(userId, oldPassword, newPassword);
    if (res.success) {
      const refreshed = authService.getCurrentUser();
      setCurrentUser(refreshed);
    }
    return res;
  };

  const resetUserPassword = (userId, actorRole = null) => {
    return authService.resetUserPassword(userId, actorRole);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        loginDemo,
        register,
        logout,
        updateProfile,
        changePassword,
        resetUserPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
