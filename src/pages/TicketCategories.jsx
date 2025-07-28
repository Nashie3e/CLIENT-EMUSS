import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import {
  ComputerRounded as ComputerIcon,
  ManageAccounts as ManageAccountsIcon,
  UploadFile as UploadFileIcon,
  AdminPanelSettings as AdminIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const TicketCategories = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const appVersion = process.env.REACT_APP_VERSION;

  // Updated category data with new colors and responsive icon sizes
  const categoryData = {
    'TROUBLESHOOTING': {
      title: 'Troubleshooting',
      description: 'Submit a ticket to resolve an issue/repairs.',
      icon: <ComputerIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />,
      path: '/troubleshooting',
      color: '#2563eb',
      gradient: 'linear-gradient(135deg, #2563eb, #3b82f6)'
    },
    'ACCOUNT_MANAGEMENT': {
      title: 'Account Management',
      description: 'Requests for DepEd and o365 account creation, password resets or updates.',
      icon: <ManageAccountsIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />,
      path: '/account',
      color: '#7c3aed',
      gradient: 'linear-gradient(135deg, #7c3aed, #8b5cf6)'
    },
    'DOCUMENT_UPLOAD': {
      title: 'Uploading of Publication',
      description: 'Assistance in submitting and uploading of publications.',
      icon: <UploadFileIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />,
      path: '/documents',
      color: '#059669',
      gradient: 'linear-gradient(135deg, #059669, #10b981)'
    },
    'TECHNICAL_ASSISTANCE': {
      title: 'Technical Assistance',
      description: 'Assistance with IT Related concerns and others.',
      icon: <ComputerIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />,
      path: '/technical-assistance',
      color: '#dc2626',
      gradient: 'linear-gradient(135deg, #dc2626, #ef4444)'
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/public/settings/categories`);
        
        if (response.data.success) {
          const fetchedCategories = response.data.categories;
          setCategories(fetchedCategories);
          setError(null);
          localStorage.setItem('ticketCategories', JSON.stringify(fetchedCategories));
        } else {
          throw new Error(response.data.message || 'Failed to load categories');
        }
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Unable to load ticket categories. Please try again later.');
        // Load from localStorage if available
        const savedCategories = localStorage.getItem('ticketCategories');
        if (savedCategories) {
          setCategories(JSON.parse(savedCategories));
        } else {
          // Fallback categories
          const fallbackCategories = [
            { id: 1, name: 'TROUBLESHOOTING', active: true },
            { id: 2, name: 'ACCOUNT_MANAGEMENT', active: true },
            { id: 3, name: 'DOCUMENT_UPLOAD', active: true },
            { id: 4, name: 'TECHNICAL_ASSISTANCE', active: true }
          ];
          setCategories(fallbackCategories);
          localStorage.setItem('ticketCategories', JSON.stringify(fallbackCategories));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (path, isActive) => {
    if (isActive) {
      navigate(path);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // If no categories are available, show a message
  if (categories.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Poppins' }}>
            Ticket categories are not available
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontFamily: 'Poppins' }}>
            Our ticket submission system cannot load the categories. Please try again later or contact support directly.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${process.env.PUBLIC_URL}/background.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.5,
          zIndex: 0,
        }
      }}
    >
      {/* Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          py: { xs: 1.5, sm: 2 }, 
          px: { xs: 2, sm: 4 }, 
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          borderBottom: '1px solid #e0e0e0',
          color: '#000000',
          borderRadius: 0,
          zIndex: 5,
          position: 'sticky',
          top: 0,
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          maxWidth: 1280,
          mx: 'auto',
          gap: { xs: 1.5, sm: 2 },
          position: 'relative',
          width: '100%',
        }}>
          <IconButton
            sx={{
              display: { xs: 'flex', sm: 'none' },
              mr: 1,
            }}
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8
              }
            }}
            onClick={() => navigate('/')}
          >
            <img 
              src={process.env.PUBLIC_URL + '/deped-logo.png'} 
              alt="DepEd Logo" 
              style={{ height: isMobile ? 44 : 54 }}
            />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 800,
                color: "#1e293b",
                fontSize: { xs: '1.1rem', sm: '1.3rem' },
                fontFamily: 'Poppins',
                letterSpacing: '-0.02em',
              }}
            >
              Ticketing System
            </Typography>
          </Box>
          <Button
            variant="text"
            size="small"
            sx={{
              ml: 'auto',
              color: '#475569',
              fontWeight: 600,
              display: { xs: 'none', sm: 'flex' },
              fontFamily: 'Poppins',
              '&:hover': {
                backgroundColor: '#f1f5f9',
                color: '#1e293b',
              }
            }}
            onClick={() => navigate('/track-ticket')}
          >
            Track Ticket
          </Button>
          <IconButton 
            aria-label="Admin Login"
            sx={{ 
              color: '#0f172a',
              backgroundColor: 'rgba(241, 245, 249, 0.8)',
              '&:hover': {
                backgroundColor: '#e2e8f0',
              }
            }}
            onClick={() => navigate('/login')}
          >
            <AdminIcon />
          </IconButton>
        </Box>
      </Paper>

      <Container 
        maxWidth="lg" 
        sx={{ 
          py: { xs: 1, sm: 2 },
          px: { xs: 2, sm: 3 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Header */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: { xs: 2, sm: 3 },
          mt: { xs: 0, sm: 1 },
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          borderRadius: { xs: '16px', sm: '24px' },
          padding: { xs: '0.75rem', sm: '1rem' },
          width: '100%',
          maxWidth: '600px',
          mx: 'auto',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 600,
              color: '#000000',
              fontSize: { xs: '1.5rem', sm: '1.8rem' },
              mb: 1,
              fontFamily: 'Poppins'
            }}
          >
            Submit a Ticket
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: '#666666',
              fontSize: { xs: '0.9rem', sm: '0.95rem' },
              fontStyle: 'italic',
              fontFamily: 'Poppins'
            }}
          >
            Please select the appropriate category for your service request
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: { xs: 2, sm: 3 },
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              '& .MuiAlert-icon': {
                color: '#d32f2f'
              }
            }}
          >
            {error}
          </Alert>
        )}

        {/* Service Categories */}
        <Box sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          borderRadius: { xs: '16px', sm: '24px' },
          padding: { xs: '0.75rem', sm: '1rem' },
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Grid 
            container 
            spacing={{ xs: 1.5, sm: 2 }}
            sx={{ 
              maxWidth: 'lg',
              mx: 'auto',
              width: '100%'
            }}
          >
            {categories.map((category) => {
              const data = categoryData[category.name];
              if (!data) return null;
              
              return (
                <Grid item xs={12} sm={6} key={category.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 2, sm: 3 },
                      height: '100%',
                      minHeight: { xs: '200px', sm: '220px' },
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: category.active ? 'pointer' : 'not-allowed',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      opacity: category.active ? 1 : 0.6,
                      background: '#ffffff',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: { xs: '16px', sm: '20px' },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: data.gradient,
                        opacity: 0,
                        transition: 'opacity 0.3s ease'
                      },
                      '&:hover': category.active ? {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
                        '&::before': {
                          opacity: 1
                        },
                        '& .icon-box': {
                          transform: 'scale(1.1)',
                          background: `${data.gradient}15`,
                          '& svg': {
                            color: data.color
                          }
                        },
                        '& .category-title': {
                          color: data.color
                        }
                      } : {},
                      '&:active': category.active ? {
                        transform: 'translateY(-4px)',
                      } : {},
                    }}
                    onClick={() => handleCategoryClick(data.path, category.active)}
                  >
                    <Box
                      className="icon-box"
                      sx={{
                        background: '#f8fafc',
                        borderRadius: '16px',
                        width: { xs: '72px', sm: '84px' },
                        height: { xs: '72px', sm: '84px' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: { xs: 2, sm: 2.5 },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '& svg': {
                          fontSize: { xs: '2rem', sm: '2.25rem' },
                          color: '#64748b',
                          transition: 'color 0.3s ease'
                        }
                      }}
                    >
                      {data.icon}
                    </Box>
                    <Typography 
                      className="category-title"
                      variant="h6" 
                      align="center" 
                      sx={{ 
                        fontWeight: 600,
                        color: '#1e293b',
                        mb: 1,
                        fontSize: { xs: '1.1rem', sm: '1.2rem' },
                        fontFamily: 'Poppins',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      {data.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      align="center" 
                      sx={{ 
                        color: '#64748b',
                        fontSize: { xs: '0.85rem', sm: '0.9rem' },
                        lineHeight: 1.5,
                        fontFamily: 'Poppins',
                        maxWidth: '90%',
                        mx: 'auto'
                      }}
                    >
                      {category.active ? data.description : "This category is currently disabled"}
                    </Typography>
                    {category.active && (
                      <Box
                        sx={{
                          mt: 2,
                          display: 'flex',
                          alignItems: 'center',
                          color: data.color,
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          fontFamily: 'Poppins',
                          opacity: 0,
                          transform: 'translateY(10px)',
                          transition: 'all 0.3s ease',
                          '.MuiPaper-root:hover &': {
                            opacity: 1,
                            transform: 'translateY(0)'
                          }
                        }}
                      >
                        Select Category
                        <Box
                          component="span"
                          sx={{
                            ml: 0.5,
                            display: 'inline-block',
                            transition: 'transform 0.3s ease',
                            '.MuiPaper-root:hover &': {
                              transform: 'translateX(4px)'
                            }
                          }}
                        >
                          →
                        </Box>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Help Text */}
        <Box 
          sx={{ 
            mt: { xs: 1, sm: 2 },
            mb: { xs: 1, sm: 1 },
            textAlign: 'center'
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666666',
              fontSize: { xs: '0.8rem', sm: '0.85rem' },
              display: 'inline-block',
              padding: { xs: '6px 12px', sm: '8px 16px' },
              borderRadius: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s',
              fontFamily: 'Poppins',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
                cursor: 'pointer',
              }
            }}
          >
            Need help choosing? Contact our support team
          </Typography>
        </Box>
      </Container>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3 },
          textAlign: 'center',
          bgcolor: 'rgba(248, 250, 252, 0.8)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid #e2e8f0',
          color: '#64748b',
          zIndex: 1,
          mt: 'auto'
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            {/* <img 
              src={process.env.PUBLIC_URL + '/deped-logo.png'} 
              alt="DepEd Logo" 
              style={{ height: 40 }}
            /> */}
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: "#334155",
                fontSize: '1rem',
                fontFamily: 'Poppins'
              }}
            >
              DepEd Imus City
            </Typography>
          </Box>
          
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '0.9rem',
              fontFamily: 'Poppins',
              mb: 1
            }}
          >
            For support inquiries: icts.imus@deped.gov.ph
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '0.85rem',
              fontFamily: 'Poppins',
              color: '#94a3b8'
            }}
          >
            © {new Date().getFullYear()} Department of Education - Imus City Division
          </Typography>

          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              fontFamily: 'Poppins',
              color: '#94a3b8',
              mt: 0.5,
              fontStyle: 'italic'
            }}
          >
            version {appVersion}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default TicketCategories; 