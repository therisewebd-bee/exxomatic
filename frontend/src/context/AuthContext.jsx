import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { login as apiLogin, signup as apiSignup } from '../services/api';
import * as ws from '../services/websocket';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fleet_user');
      const savedToken = localStorage.getItem('fleet_token_val');
      if (saved && savedToken) {
        setUser(JSON.parse(saved));
        setToken(savedToken);
      }
    } catch { /* ignore corrupt storage */ }
    setLoading(false);
  }, []);

  // Connect WS whenever we have a token
  useEffect(() => {
    if (token) {
      ws.connect();
    } else {
      ws.disconnect();
    }
  }, [token]);

  const login = useCallback(async (email, password) => {
    const res = await apiLogin({ email, password });
    const { user: u, token: t } = res.data;
    setUser(u);
    setToken(t);
    localStorage.setItem('fleet_user', JSON.stringify(u));
    localStorage.setItem('fleet_token_val', t);
    return u;
  }, []);

  const signup = useCallback(async (name, email, password, role = 'Customer') => {
    await apiSignup({ name, email, password, role });
    // Auto-login after signup
    return login(email, password);
  }, [login]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('fleet_user');
    localStorage.removeItem('fleet_token_val');
    ws.disconnect();
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'Admin',
    login,
    signup,
    logout,
  }), [user, token, loading, login, signup, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
