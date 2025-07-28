import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          setError(null);
          const response = await axios.get(`${API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.data.success) {
            const userData = {
              ...response.data.user,
              isAdmin: response.data.user.role === 'ADMIN',
              isStaff: response.data.user.role === 'STAFF',
              isUser: response.data.user.role === 'USER'
            };
            setUser(userData);
            setIsAuthenticated(true);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Store user in localStorage for socket authentication
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            throw new Error(response.data.message || 'Failed to load user data');
          }
        } catch (error) {
          console.error('Error loading user:', error);
          if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
            delete axios.defaults.headers.common['Authorization'];
          }
          setError(error.response?.data?.message || 'Failed to authenticate user');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (userData, token) => {
    try {
      // Add role-based flags
      const enhancedUserData = {
        ...userData,
        isAdmin: userData.role === 'ADMIN',
        isStaff: userData.role === 'STAFF',
        isUser: userData.role === 'USER'
      };
      
      setUser(enhancedUserData);
      setIsAuthenticated(true);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(enhancedUserData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setError(null);
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to set user data');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setError(null);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 