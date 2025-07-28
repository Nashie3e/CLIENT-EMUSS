import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Box, Typography, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { AdminPanelSettings as AdminIcon } from '@mui/icons-material';
import { headerStyles } from '../styles';

const Header = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper elevation={0} sx={headerStyles.paper}>
      <Box sx={headerStyles.container}>
        <Box sx={headerStyles.logo} onClick={() => navigate('/')}>
          <img 
            src={process.env.PUBLIC_URL + '/deped-logo.png'} 
            alt="DepEd Logo" 
            style={{ height: isMobile ? 44 : 54 }}
          />
          <Typography variant="h6" sx={headerStyles.title}>
            Ticketing System
          </Typography>
        </Box>
        <IconButton 
          aria-label="Admin Login"
          sx={headerStyles.adminButton}
          onClick={() => navigate('/login')}
        >
          <AdminIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default Header; 