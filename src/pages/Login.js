import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        // Login successful - the AuthContext will handle the state
        console.log('Login successful');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const backgroundStyle = {
    backgroundImage: 'url(/background.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  // If already authenticated, show a message
  if (isAuthenticated) {
    return (
      <div className="login-container" style={backgroundStyle}>
        <div className="login-left">
          {/* Empty space on the left */}
        </div>
        <div className="login-right">
          <div className="login-form-container">
            <h1 className="login-title">Welcome Back!</h1>
            <p className="login-subtitle">You are already logged in.</p>
            <button 
              onClick={() => window.location.reload()}
              className="login-button"
              style={{ marginTop: '2rem' }}
            >
              Continue to Admin Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container" style={backgroundStyle}>
      <div className="login-left">
        {/* Empty space on the left */}
      </div>
      <div className="login-right">
        <div className="login-form-container">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your account</p>
          
          {error && (
            <div style={{
              background: '#fee',
              color: '#c33',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              border: '1px solid #fcc',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" className="checkbox" disabled={isLoading} />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>
            
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            background: '#f8f9fa', 
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#666'
          }}>
            <strong>Demo Credentials:</strong><br />
            Email: admin@medical.com<br />
            Password: admin123
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login; 