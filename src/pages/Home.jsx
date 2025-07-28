import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  Button,
  Divider,
  IconButton,
  Stack,
} from '@mui/material';
import {
  AddCircleOutline as AddIcon,
  ListAlt as ListIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isExtraSmall = useMediaQuery('(max-width:400px)');
  const appVersion = process.env.REACT_APP_VERSION;

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: '#f8fafc',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("/background.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.6,
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.15))',
          zIndex: 0,
        },
      }}
    >
      {/* Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          py: { xs: 1, sm: 1.5, md: 2 }, 
          px: { xs: 1.5, sm: 2, md: 4 }, 
          bgcolor: '#ffffff',
          borderBottom: '1px solid #e0e0e0',
          color: '#000000',
          borderRadius: 0,
          zIndex: 6,
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
          gap: { xs: 1, sm: 1.5, md: 2 },
          position: 'relative',
          width: '100%',
        }}>
          <img 
            src={process.env.PUBLIC_URL + '/deped-logo.png'} 
            alt="DepEd Logo" 
            style={{ height: isMobile ? 36 : isExtraSmall ? 30 : 54 }}
          />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 800,
              color: "#1e293b",
              fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.3rem' },
              fontFamily: 'Poppins',
              letterSpacing: '-0.02em',
            }}
          >
            Ticketing System
          </Typography>

          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <IconButton 
              aria-label="Admin Login"
              size={isMobile ? "small" : "medium"}
            sx={{ 
                color: '#0f172a',
                backgroundColor: 'rgba(241, 245, 249, 0.8)',
              '&:hover': {
                  backgroundColor: '#e2e8f0',
              }
            }}
            onClick={() => navigate('/login')}
          >
              <AdminIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Hero Section */}
      <Box
        sx={{ 
          position: 'relative',
          zIndex: 1,
          py: { xs: 4, sm: 8, md: 12, lg: 16 },
          px: { xs: 1.5, sm: 2, md: 4 },
          textAlign: 'center',
          background: 'transparent',
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        <Container maxWidth="md" sx={{ width: '100%' }}>
          <Typography 
            variant="h2"
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
              lineHeight: 1.2,
              mb: { xs: 1.5, sm: 2 },
              color: '#0f172a',
              fontFamily: 'Poppins',
              letterSpacing: '-0.02em',
            }}
          >
                        Welcome to <span style={{ color: '#1976d2' }}>Dep</span><span style={{ color: '#f44336' }}>ED</span><br /> Imus City{' '}
            <Typography 
              component="span" 
              variant="inherit" 
              sx={{ 
                color: '#1976d2',
                position: 'relative',
                marginLeft: '5px',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-4px',
                  left: '0',
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#1976d210',
                  zIndex: -1,
                  borderRadius: '4px',
                }
              }}
            >
              Ticketing
            </Typography>
          </Typography>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={{ xs: 2, sm: 2 }} 
            justifyContent="center" 
            sx={{ mb: { xs: 4, sm: 6 }, mt: { xs: 4, sm: 6 }, width: '100%' }}
          >
            <Button
              variant="contained"
              size={isMobile ? "medium" : "large"}
              fullWidth={isMobile}
              startIcon={<AddIcon />}
              onClick={() => navigate('/tickets')}
            sx={{ 
                bgcolor: '#1976d2',
                fontWeight: 600,
                py: { xs: 1.2, sm: 1.5 },
                px: { xs: 2, sm: 3 },
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontFamily: 'Poppins',
                '&:hover': {
                  bgcolor: '#1565c0',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
                },
                transition: 'all 0.2s ease',
                minWidth: { xs: '100%', sm: 'auto' },
              }}
            >
              Submit a New Ticket
            </Button>
            <Button
              variant="outlined"
              size={isMobile ? "medium" : "large"}
              fullWidth={isMobile}
              startIcon={<ListIcon />}
                onClick={() => navigate('/track-ticket')}
              sx={{
                color: '#ffffff',
                backgroundColor: '#000000',
                borderColor: '#000000',
                fontWeight: 600,
                py: { xs: 1.2, sm: 1.5 },
                px: { xs: 2, sm: 3 },
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontFamily: 'Poppins',
                '&:hover': {
                  borderColor: '#333333',
                  backgroundColor: '#333333',
                },
                minWidth: { xs: '100%', sm: 'auto' },
              }}
            >
              Track Your Ticket
            </Button>
          </Stack>
          
          <Divider sx={{ 
            maxWidth: '200px', 
            mx: 'auto', 
            borderColor: '#e2e8f0', 
            mb: 4 
          }} />
      </Container>
      </Box>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 1.5, sm: 2, md: 3 },
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
          <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            {/* <img 
              src={process.env.PUBLIC_URL + '/deped-logo.png'} 
              alt="DepEd Logo" 
              style={{ height: isMobile ? 30 : 40 }}
            /> */}
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: "#334155",
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontFamily: 'Poppins'
              }}
            >
              DepEd Imus City
            </Typography>
          </Box>
          
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
              fontFamily: 'Poppins',
              mb: 0.5
            }}
          >
            For support inquiries:<br className={isExtraSmall ? '' : 'hidden'} /> icts.imus@deped.gov.ph
          </Typography>
          
        <Typography 
          variant="body2" 
          sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.85rem' },
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

export default Home; 