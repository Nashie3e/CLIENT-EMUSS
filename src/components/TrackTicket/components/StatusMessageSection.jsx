import React from 'react';
import { Box, Typography, Alert, Button } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

const StatusMessageSection = ({ ticket }) => {
  const getStatusMessage = () => {
    switch (ticket.status) {
      case 'PENDING':
        return (
          <Box sx={{ 
            mt: 4,
            p: 4,
            background: 'linear-gradient(135deg, #fef3e0 0%, #fef4e6 100%)',
            borderRadius: 3,
            border: '1px solid rgba(234, 88, 12, 0.2)',
            boxShadow: '0 8px 20px rgba(234, 88, 12, 0.08), 0 2px 8px rgba(234, 88, 12, 0.04)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              background: 'linear-gradient(180deg, #ea580c, #f97316)',
              borderRadius: '2px 0 0 2px'
            }
          }}>
            <Typography variant="h5" sx={{ 
              color: '#1e293b', 
              mb: 2, 
              fontWeight: 700, 
              fontFamily: 'Poppins',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              fontSize: '1.3rem'
            }}>
              🕒 Ticket Status: Pending Review
            </Typography>
            <Typography variant="body1" sx={{ 
              color: '#64748b',
              fontFamily: 'Poppins',
              lineHeight: 1.6,
              fontSize: '1rem'
            }}>
              Your ticket is currently in our queue. We process requests in order of priority and submission time. You will receive an email notification when your ticket status changes.
            </Typography>
          </Box>
        );

      case 'IN_PROGRESS':
        if (ticket.category === 'ACCOUNT_MANAGEMENT') {
          return (
            <Box sx={{ 
              mt: 4,
              p: 4,
              background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)',
              borderRadius: 3,
              border: '1px solid rgba(59, 130, 246, 0.2)',
              boxShadow: '0 8px 20px rgba(59, 130, 246, 0.08), 0 2px 8px rgba(59, 130, 246, 0.04)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                background: 'linear-gradient(180deg, #3b82f6, #60a5fa)',
                borderRadius: '2px 0 0 2px'
              }
            }}>
              <Typography variant="h5" sx={{ 
                color: '#1e293b', 
                mb: 2, 
                fontWeight: 700, 
                fontFamily: 'Poppins',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                fontSize: '1.3rem'
              }}>
                📝 Action Required: Fill Out Excel Form
              </Typography>
              <Typography variant="body1" sx={{ 
                color: '#64748b', 
                mb: 3,
                fontFamily: 'Poppins',
                lineHeight: 1.6,
                fontSize: '1rem'
              }}>
                Please check your email for the Excel form link. You need to complete this form for your account request to proceed.
              </Typography>
              <Alert severity="info" sx={{ 
                bgcolor: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid rgba(59, 130, 246, 0.1)',
                borderRadius: 2,
                '& .MuiAlert-message': {
                  fontFamily: 'Poppins',
                  fontSize: '1rem'
                }
              }}>
                <Typography variant="body1" sx={{ fontFamily: 'Poppins' }}>
                  The required Excel form link has been sent to your email address. Please fill it out completely and accurately.
                </Typography>
              </Alert>
            </Box>
          );
        }
        return null;

      case 'RESOLVED':
        if (ticket.category === 'ACCOUNT_MANAGEMENT') {
          return (
            <Box sx={{ 
              mt: 4,
              p: 4,
              background: 'linear-gradient(135deg, #f0fdf4 0%, #f0fdf5 100%)',
              borderRadius: 3,
              border: '1px solid rgba(34, 197, 94, 0.2)',
              boxShadow: '0 8px 20px rgba(34, 197, 94, 0.08), 0 2px 8px rgba(34, 197, 94, 0.04)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                background: 'linear-gradient(180deg, #22c55e, #4ade80)',
                borderRadius: '2px 0 0 2px'
              }
            }}>
              <Typography variant="h5" sx={{ 
                color: '#1e293b', 
                mb: 2, 
                fontWeight: 700, 
                fontFamily: 'Poppins',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                fontSize: '1.3rem'
              }}>
                ✅ Account Management Request Completed
              </Typography>
              <Typography variant="body1" sx={{ 
                color: '#64748b', 
                mb: 3,
                fontFamily: 'Poppins',
                lineHeight: 1.6,
                fontSize: '1rem'
              }}>
                Your account management request has been completed. Please check your email for the Excel form and further instructions.
              </Typography>
              <Alert severity="success" sx={{ 
                bgcolor: 'rgba(34, 197, 94, 0.05)',
                border: '1px solid rgba(34, 197, 94, 0.1)',
                borderRadius: 2,
                mb: 3,
                '& .MuiAlert-message': {
                  fontFamily: 'Poppins',
                  fontSize: '1rem'
                }
              }}>
                <Typography variant="body1" sx={{ fontFamily: 'Poppins' }}>
                  The Excel form link and account details have been sent to your email. Please follow the instructions provided in the email.
                </Typography>
              </Alert>
              <Button
                variant="contained"
                size="large"
                onClick={() => window.open('https://csm.depedimuscity.com/', '_blank')}
                startIcon={<InfoIcon />}
                sx={{ 
                  py: 2,
                  px: 4,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontFamily: 'Poppins',
                  fontSize: '1rem',
                  bgcolor: '#22c55e',
                  color: '#ffffff',
                  boxShadow: '0 8px 20px rgba(34, 197, 94, 0.3)',
                  '&:hover': {
                    bgcolor: '#16a34a',
                    boxShadow: '0 10px 25px rgba(34, 197, 94, 0.4)',
                    transform: 'translateY(-2px)'
                  }
                }}
                fullWidth
              >
                🌟 Share Your Feedback
              </Button>
            </Box>
          );
        } else {
          return (
            <Box sx={{ 
              mt: 4,
              p: 4,
              background: 'linear-gradient(135deg, #f0fdf4 0%, #f0fdf5 100%)',
              borderRadius: 3,
              border: '1px solid rgba(34, 197, 94, 0.2)',
              boxShadow: '0 8px 20px rgba(34, 197, 94, 0.08), 0 2px 8px rgba(34, 197, 94, 0.04)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                background: 'linear-gradient(180deg, #22c55e, #4ade80)',
                borderRadius: '2px 0 0 2px'
              }
            }}>
              <Typography variant="h5" sx={{ 
                color: '#1e293b', 
                mb: 2, 
                fontWeight: 700, 
                fontFamily: 'Poppins',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                fontSize: '1.3rem'
              }}>
                🎉 Ticket Resolved Successfully!
              </Typography>
              <Typography variant="body1" sx={{ 
                color: '#64748b', 
                mb: 3,
                fontFamily: 'Poppins',
                lineHeight: 1.6,
                fontSize: '1rem'
              }}>
                We're glad we could help! Your feedback is important to us and helps improve our service.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => window.open('https://csm.depedimuscity.com/', '_blank')}
                startIcon={<InfoIcon />}
                sx={{ 
                  py: 2,
                  px: 4,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontFamily: 'Poppins',
                  fontSize: '1rem',
                  bgcolor: '#22c55e',
                  color: '#ffffff',
                  boxShadow: '0 8px 20px rgba(34, 197, 94, 0.3)',
                  '&:hover': {
                    bgcolor: '#16a34a',
                    boxShadow: '0 10px 25px rgba(34, 197, 94, 0.4)',
                    transform: 'translateY(-2px)'
                  }
                }}
                fullWidth
              >
                🌟 Share Your Feedback
              </Button>
            </Box>
          );
        }

      default:
        return null;
    }
  };

  return getStatusMessage();
};

export default StatusMessageSection; 