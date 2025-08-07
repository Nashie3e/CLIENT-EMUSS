  import React, { createContext, useContext, useState, useEffect } from 'react';

  const AuthContext = createContext();

  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };

  export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = (email, password) => {
      // Simple authentication logic - in a real app, this would call an API
      if (email === 'admin@medical.com' && password === 'admin123') {
        const userData = {
          id: 1,
          email: email,
          name: 'Admin User',
          role: 'admin'
        };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, user: userData }));
        return { success: true , role: 'admin'};
      }
      else if (email === 'titengmalaki@gmail.com' && password === 'user123') {
        const userData = {
          id: 2,
          email: email,
          name: 'Titeng Malaki',
          role: 'user'

        };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, user: userData }));
        return { success: true , role: 'user'};
      }
      else {
        return { success: false, message: 'Invalid credentials' };
      }
    };

    const logout = () => {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('auth');
    };

    const checkAuth = () => {
      const authData = localStorage.getItem('auth');
      if (authData) {
        try {
          const { isAuthenticated: auth, user: userData } = JSON.parse(authData);
          setIsAuthenticated(auth);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing auth data:', error);
          localStorage.removeItem('auth');
        }
      }
      setIsLoading(false);
    };

    useEffect(() => {
      checkAuth();
    }, []);

    const value = {
      isAuthenticated,
      user,
      login,
      logout,
      checkAuth,
      isLoading
    };

    if (isLoading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: '#f5f7fa',
          fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🔄</div>
            <p style={{ color: '#666', margin: 0 }}>Loading...</p>
          </div>
        </div>
      );
    }

    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
  }; 