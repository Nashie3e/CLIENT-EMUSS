import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  AccountCircle as AccountCircleIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Define global styles for animations
const globalAnimations = {
  '@keyframes shine': {
    '0%': {
      backgroundPosition: '-100% 0'
    },
    '100%': {
      backgroundPosition: '200% 0'
    }
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      opacity: 0.8
    },
    '50%': {
      transform: 'scale(1.05)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 0.8
    }
  },
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(10px)'
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)'
    }
  },
  '@keyframes floatIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(20px)'
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)'
    }
  }
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Add useMediaQuery hook for responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        if (data.errors) {
          const errorMessages = data.errors.map(err => err.message).join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || 'Login failed');
      }

      const { role } = data.data.user;
      if (role !== 'ADMIN' && role !== 'STAFF') {
        throw new Error('Invalid role. Access denied.');
      }

      login(data.data.user, data.data.token);
      
      if (role === 'ADMIN') {
        navigate('/admin');
      } else if (role === 'STAFF') {
        navigate('/ict-coor');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const appVersion = process.env.REACT_APP_VERSION;

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        ...globalAnimations,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${process.env.PUBLIC_URL}/background.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.7)',
          zIndex: 0,
        },
      }}
    >
      {/* RTX Light Effects - adjusted for mobile */}
      <Box
        sx={{
          position: 'absolute',
          top: isMobile ? '5%' : '10%',
          right: isMobile ? '2%' : '5%',
          width: isMobile ? '150px' : '300px',
          height: isMobile ? '150px' : '300px',
          background: 'radial-gradient(circle, rgba(25, 118, 210, 0.25), transparent 70%)',
          zIndex: 1,
          opacity: 0.7,
          filter: 'blur(50px)',
          animation: 'pulse 8s infinite ease-in-out',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: isMobile ? '10%' : '20%',
          left: isMobile ? '5%' : '10%',
          width: isMobile ? '120px' : '250px',
          height: isMobile ? '120px' : '250px',
          background: 'radial-gradient(circle, rgba(66, 165, 245, 0.2), transparent 70%)',
          zIndex: 1,
          opacity: 0.6,
          filter: 'blur(40px)',
          animation: 'pulse 10s infinite ease-in-out 1s',
          pointerEvents: 'none',
        }}
      />

      {/* Overlay gradient */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)',
          zIndex: 1,
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 70% 30%, rgba(25, 118, 210, 0.1), transparent 60%)',
            zIndex: 0,
          }
        }}
      />

      {/* Content Container - adjusted for mobile */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '1200px',
          margin: 'auto',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: isMobile ? 'center' : 'space-between',
          position: 'relative',
          zIndex: 2,
          px: { xs: 2, sm: 4, md: 6 },
          py: isMobile ? 4 : 0,
        }}
      >
        {/* Mobile Header for small screens */}
        {isMobile && (
          <Box
            sx={{
              color: 'white',
              textAlign: 'center',
              mb: 4,
              animation: 'fadeIn 0.8s ease-out',
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                mb: 2,
                fontFamily: 'Poppins',
                textShadow: '2px 2px 30px rgba(0,0,0,0.5), 0 0 30px rgba(25, 118, 210, 0.3)',
              }}
            >
              <Box component="span" sx={{ color: '#1976d2' }}>Dep</Box><Box component="span" sx={{ color: '#e53935' }}>ED</Box> Imus City
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                opacity: 0.9,
                fontWeight: 400,
                fontFamily: 'Poppins',
                textShadow: '1px 1px 10px rgba(0,0,0,0.3)',
                animation: 'fadeIn 1s ease-out 0.3s both',
              }}
            >
              SDO Ticketing Portal
            </Typography>
          </Box>
        )}

        {/* Left side - Welcome Text (hidden on mobile) */}
        <Box
          sx={{
            flex: 1,
            color: 'white',
            pr: 4,
            display: { xs: 'none', md: 'block' },
            animation: 'fadeIn 0.8s ease-out',
          }}
        >
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700,
              mb: 3,
              fontSize: { md: '2.5rem', lg: '3rem' },
              fontFamily: 'Poppins',
              textShadow: '2px 2px 30px rgba(0,0,0,0.5), 0 0 30px rgba(25, 118, 210, 0.3)',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '60px',
                height: '4px',
                bottom: '-10px',
                left: '0',
                background: 'linear-gradient(90deg, #2196f3, transparent)',
                borderRadius: '2px'
              }
            }}
          >
            Welcome to <Box component="span" sx={{ color: '#1976d2' }}>Dep</Box><Box component="span" sx={{ color: '#e53935' }}>Ed</Box> Imus City
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4,
              opacity: 0.9,
              fontWeight: 400,
              fontSize: { md: '1.1rem', lg: '1.2rem' },
              fontFamily: 'Poppins',
              textShadow: '1px 1px 10px rgba(0,0,0,0.3)',
              animation: 'fadeIn 1s ease-out 0.3s both',
              maxWidth: '80%'
            }}
          >
            Access the SDO Ticketing Portal.
          </Typography>
        </Box>

        {/* Right side - Login Form */}
        <Paper
          elevation={24}
          sx={{
            width: { xs: '100%', sm: '450px' },
            maxWidth: isMobile ? '90%' : '450px',
            bgcolor: 'rgba(255, 255, 255, 0.92)',
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(25, 118, 210, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            animation: 'floatIn 0.6s ease-out',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.25), rgba(255,255,255,0))',
              zIndex: 0,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '-50%',
              right: '-50%',
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(25, 118, 210, 0.1), transparent 70%)',
              zIndex: 0,
            }
          }}
        >
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}>
            {/* Logo */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 3,
                position: 'relative',
                animation: 'pulse 6s infinite ease-in-out',
              }}
            >
              <Box
                component="img"
                src={process.env.PUBLIC_URL + '/deped-logo.png'}
                alt="DepEd Logo"
                sx={{
                  width: isMobile ? 70 : 90,
                  height: isMobile ? 70 : 90,
                  filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.15))',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    filter: 'drop-shadow(0 15px 20px rgba(0,0,0,0.2))',
                  }
                }}
              />
            </Box>

            <Typography 
              variant="h4" 
              align="center" 
              sx={{ 
                fontWeight: 800,
                mb: 1,
                color: '#1565c0',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                fontSize: isMobile ? '1.3rem' : '1.5rem',
                fontFamily: 'Poppins',
                textShadow: '0 2px 5px rgba(21, 101, 192, 0.15)',
                animation: 'fadeIn 0.5s ease-out 0.3s both',
              }}
            >
              SDO Portal
            </Typography>
            <Typography 
              variant="subtitle1" 
              align="center" 
              sx={{ 
                mb: 4,
                color: '#455a64',
                fontWeight: 500,
                letterSpacing: '0.5px',
                fontSize: '0.9rem',
                fontFamily: 'Poppins',
                animation: 'fadeIn 0.5s ease-out 0.4s both',
              }}
            >
              Login
            </Typography>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  width: '100%', 
                  mb: 3,
                  borderRadius: '8px',
                  animation: 'fadeIn 0.3s ease-out',
                  boxShadow: '0 4px 12px rgba(211, 47, 47, 0.15)',
                  '& .MuiAlert-message': {
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    fontFamily: 'Poppins'
                  }
                }}
              >
                {error}
              </Alert>
            )}

            <Box 
              component="form" 
              onSubmit={handleSubmit}
              sx={{ 
                width: '100%',
                animation: 'fadeIn 0.5s ease-out 0.5s both',
              }}
            >
              <TextField
                fullWidth
                required
                name="email"
                label="Username"
                value={formData.email}
                onChange={handleChange}
                sx={{ 
                  mb: 2.5,
                  '& .MuiInputLabel-root': {
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    fontFamily: 'Poppins'
                  },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.85)',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#1976d2',
                    },
                    '& .MuiOutlinedInput-input': {
                      fontFamily: 'Poppins',
                      padding: '14px 14px'
                    }
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleIcon sx={{ 
                        color: '#1976d2',
                        filter: 'drop-shadow(0 1px 2px rgba(25, 118, 210, 0.3))'
                      }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                required
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                sx={{ 
                  mb: 3,
                  '& .MuiInputLabel-root': {
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    fontFamily: 'Poppins'
                  },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.85)',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#1976d2',
                    },
                    '& .MuiOutlinedInput-input': {
                      fontFamily: 'Poppins',
                      padding: '14px 14px'
                    }
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ 
                        color: '#1976d2',
                        filter: 'drop-shadow(0 1px 2px rgba(25, 118, 210, 0.3))'
                      }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ 
                          color: '#1976d2',
                          '&:hover': {
                            background: 'rgba(25, 118, 210, 0.1)',
                          }
                        }}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{ 
                  mb: 2,
                  py: isMobile ? 1.2 : 1.5,
                  position: 'relative',
                  overflow: 'hidden',
                  bgcolor: '#1565c0',
                  fontSize: isMobile ? '0.95rem' : '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(21, 101, 192, 0.25)',
                  fontFamily: 'Poppins',
                  transition: 'all 0.3s ease',
                  background: 'linear-gradient(45deg, #1565c0, #0d47a1)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0) 100%)',
                    transform: 'translateX(-100%)',
                    transition: 'transform 0.9s ease',
                    zIndex: 1
                  },
                  '&:hover': {
                    bgcolor: '#0d47a1',
                    boxShadow: '0 6px 16px rgba(21, 101, 192, 0.35)',
                    transform: 'translateY(-2px)',
                    '&::before': {
                      transform: 'translateX(100%)',
                    }
                  }
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Login'}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/')}
                disabled={loading}
                sx={{ 
                  py: isMobile ? 1.2 : 1.5,
                  borderRadius: '12px',
                  fontSize: isMobile ? '0.9rem' : '0.95rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  fontFamily: 'Poppins',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(5px)',
                  boxShadow: '0 2px 6px rgba(25, 118, 210, 0.08)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.1), transparent)',
                    transition: 'all 0.3s ease',
                    opacity: 0,
                    zIndex: -1
                  },
                  '&:hover': {
                    borderColor: '#1565c0',
                    background: 'rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.12)',
                    transform: 'translateY(-2px)',
                    '&::before': {
                      opacity: 1
                    }
                  }
                }}
              >
                Return to Home
              </Button>
            </Box>

            {/* Bottom Logos - adjusted for mobile */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: isMobile ? 2 : 4,
                mt: isMobile ? 3 : 4,
                pt: 2,
                borderTop: '1px solid rgba(0,0,0,0.1)',
                animation: 'fadeIn 0.5s ease-out 0.7s both',
              }}
            >
              <Box
                component="img"
                src={process.env.PUBLIC_URL + '/logo-1.png'}
                alt="Logo 1"
                sx={{
                  height: isMobile ? 45 : 60,
                  width: 'auto',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.2))',
                  }
                }}
              />
              <Box
                component="img"
                src={process.env.PUBLIC_URL + '/logo-2.png'}
                alt="Logo 2"
                sx={{
                  height: isMobile ? 45 : 60,
                  width: 'auto',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.2))',
                  }
                }}
              />
            </Box>

            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                fontFamily: 'Poppins',
                color: '#94a3b8',
                mt: 0.5,
                fontStyle: 'italic',
                animation: 'fadeIn 0.5s ease-out 0.8s both',
              }}
            >
              version {appVersion}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login; 