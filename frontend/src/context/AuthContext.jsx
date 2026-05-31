import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      if (response.data && response.data.success) {
        const authData = response.data.data;
        const userData = {
          username: authData.username,
          role: authData.role,
          fullName: authData.fullName,
          email: authData.email,
        };
        
        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setToken(authData.token);
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, message: response.data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      const msg = error.response?.data?.message || 'Invalid username or password';
      return { success: false, message: msg };
    }
  };

  const register = async (username, password, email, fullName, role) => {
    try {
      const response = await api.post('/auth/register', {
        username,
        password,
        email,
        fullName,
        role
      });
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAdmin = () => {
    return user && user.role === 'ADMIN';
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
