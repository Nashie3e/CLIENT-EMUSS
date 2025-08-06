import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem',
        background: '#f5f7fa',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Access Denied</h2>
          <p style={{ color: '#7f8c8d', marginBottom: '1.5rem' }}>
            You need to be logged in to access this page.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: '#3498db',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute; 