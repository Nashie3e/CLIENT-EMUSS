import React from 'react';
import { Box, Container, Typography, Link, Chip } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { footerStyles } from '../styles';
import { formatDate } from '../utils';

const Footer = ({ ticket = null }) => {
  const appVersion = process.env.REACT_APP_VERSION;

  return (
    <Box sx={{ mt: 'auto' }}>
      {/* Ticket Footer Section - Only show when ticket data is available */}
      {ticket && (
        <Box sx={{ 
          mt: 4,
          pt: 3,
          borderTop: '2px solid rgba(37, 99, 235, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3
        }}>
          <Typography 
            variant="body1" 
            color="#64748b" 
            sx={{ 
              fontFamily: 'Poppins',
              fontWeight: 500,
              fontSize: '0.95rem'
            }}
          >
            📅 Last updated: {formatDate(ticket.updatedAt)}
          </Typography>
          <Chip
            label={`⏰ Ticket Age: ${Math.ceil((new Date() - new Date(ticket.createdAt)) / (1000 * 60 * 60 * 24))} days`}
            size="medium"
            sx={{ 
              bgcolor: 'rgba(37, 99, 235, 0.08)', 
              color: '#2563eb',
              fontFamily: 'Poppins',
              fontWeight: 600,
              fontSize: '0.875rem',
              border: '1px solid rgba(37, 99, 235, 0.2)',
              '& .MuiChip-label': {
                fontFamily: 'Poppins',
                fontWeight: 600
              }
            }}
          />
        </Box>
      )}

      {/* Help Section */}
      <Box sx={{ 
        mt: 4, 
        textAlign: 'center',
        p: 3,
        borderRadius: 2,
        bgcolor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)'
      }}>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            flexWrap: 'wrap',
            mb: 2
          }}
        >
          <InfoIcon fontSize="small" />
          Having trouble with your ticket ID? The new format looks like TK-1F4D89Z7
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}
        >
          Need help? Contact our support team at
          <Link 
            href="mailto:icts.imus@deped.gov.ph"
            sx={{
              color: '#000000',
              textDecoration: 'none',
              fontWeight: 500,
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            icts.imus@deped.gov.ph
          </Link>
        </Typography>
      </Box>

      {/* Main Footer with Version */}
      <Box component="footer" sx={footerStyles.container}>
        <Container maxWidth="md">
          <Box sx={footerStyles.logoContainer}>
            <img 
              src={process.env.PUBLIC_URL + '/deped-logo.png'} 
              alt="DepEd Logo" 
              style={{ height: 40 }}
            />
            <Typography variant="h6" sx={footerStyles.logoText}>
              DepEd Imus City
            </Typography>
          </Box>
          
          <Typography variant="body2" sx={footerStyles.supportText}>
            For support inquiries: icts.imus@deped.gov.ph
          </Typography>
          
          <Typography variant="body2" sx={footerStyles.copyrightText}>
            © {new Date().getFullYear()} Department of Education - Imus City Division
          </Typography>

          {/* Version Display - Integrated into main footer */}
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              fontFamily: 'Poppins',
              color: '#94a3b8',
              fontStyle: 'italic',
              mt: 1
            }}
          >
            version {appVersion}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer; 