import { createContext, useContext, useState, useEffect } from 'react';
import api from '../shared/utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // bootstrapping from localStorage

  // ── Bootstrap from localStorage on mount ──────────────────────────────────
  useEffect(() => {
    const savedToken = localStorage.getItem('rc_token');
    const savedUser  = localStorage.getItem('rc_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('rc_token');
        localStorage.removeItem('rc_user');
      }
    }
    setLoading(false);
  }, []);

  // ── Signup ─────────────────────────────────────────────────────────────────
  const signup = async ({ name, username, email, password }) => {
    const res = await api.post('/api/auth/signup', { name, username, email, password });
    const { access_token, user: userData } = res.data;
    _persist(access_token, userData);
    return res.data;
  };

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = async ({ identifier, password }) => {
    const res = await api.post('/api/auth/login', { identifier, password });
    const { access_token, user: userData } = res.data;
    _persist(access_token, userData);
    return res.data;
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('rc_token');
    localStorage.removeItem('rc_user');
  };

  // ── Internal helper ────────────────────────────────────────────────────────
  const _persist = (access_token, userData) => {
    setToken(access_token);
    setUser(userData);
    localStorage.setItem('rc_token', access_token);
    localStorage.setItem('rc_user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signup, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
