import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi, userApi } from '../apiConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkCurrentAuth();
  }, []);

  const checkCurrentAuth = async () => {
    try {
      setLoading(true);
      const res = await authApi.checkAuth();
      if (res.status === 200) {
        setUser(res.user);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const res = await authApi.login(email, password);
      
      // Handle 2FA required
      if (res["2fa_required"]) {
        return { twoFactorRequired: true, email: res.email };
      }
      
      if (res.status === 200) {
        setUser(res.user);
      }
      return res;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const verify2fa = async (email, code) => {
    try {
      setError(null);
      setLoading(true);
      const res = await authApi.verify2fa(email, code);
      if (res.status === 200) {
        setUser(res.user);
      }
      return res;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (firstName, lastName, email, password) => {
    try {
      setError(null);
      setLoading(true);
      const res = await authApi.signup(firstName, lastName, email, password);
      if (res.status === 200) {
        setUser(res.user);
      }
      return res;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authApi.logout();
      setUser(null);
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      setLoading(false);
    }
  };

  const updateCategorySetup = async (setupData) => {
    try {
      const res = await userApi.saveCategorySetup(setupData);
      // Refresh user profile details
      await checkCurrentAuth();
      return res;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    verify2fa,
    signup,
    logout,
    updateCategorySetup,
    checkCurrentAuth
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
