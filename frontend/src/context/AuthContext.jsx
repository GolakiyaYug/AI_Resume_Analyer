import { createContext, useContext, useState, useEffect } from 'react';
import api from '../shared/utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const signupInit = async (data) => {
    const res = await api.post('/api/auth/signup-init', data);
    return res.data;
  };

  const signupVerify = async (email, code) => {
    const res = await api.post('/api/auth/signup-verify', { email, code });
    const { access_token, user: userData } = res.data;
    _persist(access_token, userData);
    return res.data;
  };

  const loginInit = async (data) => {
    const res = await api.post('/api/auth/login-init', data);
    return res.data;
  };

  const loginVerify = async (username, email, code) => {
    const res = await api.post('/api/auth/login-verify', { username, email, code });
    const { access_token, user: userData } = res.data;
    _persist(access_token, userData);
    return res.data;
  };

  const resendOtp = async (email) => {
    const res = await api.post('/api/auth/resend-otp', { email });
    return res.data;
  };

  const profileEditInit = async (data) => {
    const res = await api.post('/api/auth/profile-edit-init', data);
    if (!res.data.otp_required) {
      setUser(res.data.user);
      localStorage.setItem('rc_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const profileEditVerify = async (code) => {
    const res = await api.post('/api/auth/profile-edit-verify', { code });
    const { access_token, user: userData } = res.data;
    _persist(access_token, userData);
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('rc_token');
    localStorage.removeItem('rc_user');
  };

  const _persist = (access_token, userData) => {
    setToken(access_token);
    setUser(userData);
    localStorage.setItem('rc_token', access_token);
    localStorage.setItem('rc_user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ 
      user, token, loading, 
      signupInit, signupVerify, loginInit, loginVerify, resendOtp, 
      profileEditInit, profileEditVerify,
      logout, isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
