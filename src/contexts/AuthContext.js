// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Fallback sûr si la variable n'est pas définie
const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8001').replace(/\/+$/, '');
const API = `${BACKEND_URL}/api`;

// Instance axios avec timeout plus large
const http = axios.create({
  baseURL: API,
  timeout: 30000, // 30s pour éviter le timeout trop court pendant la première connexion DB
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await http.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error?.message || error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await http.post('/auth/login', { email, password });
    const { access_token, user: userData } = response.data;
    setToken(access_token);
    setUser(userData);
    localStorage.setItem('token', access_token);
    return userData;
  };

  const register = async (email, password, referralCode = null) => {
    const payload = { email, password };
    if (referralCode) payload.referral_code = referralCode;
    const response = await http.post('/auth/register', payload);
    const { access_token, user: userData } = response.data;
    setToken(access_token);
    setUser(userData);
    localStorage.setItem('token', access_token);
    return userData;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
