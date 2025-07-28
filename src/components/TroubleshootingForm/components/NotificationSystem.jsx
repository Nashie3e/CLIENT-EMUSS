import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Snackbar, 
  Typography, 
  IconButton, 
  Button, 
  Box,
  Fade,
  Paper
} from '@mui/material';
import { 
  Close as CloseIcon,
  Visibility as ViewIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const NotificationSystem = ({
  showNotification,
  currentNotification,
  handleNotificationClose
}) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  // Timer for auto-dismiss
  useEffect(() => {
    let dismissTimer;
    if (showNotification && currentNotification?.duration) {
      dismissTimer = setTimeout(() => {
        handleNotificationClose(null, 'timeout');
      }, currentNotification.duration);
    }
    
    return () => {
      if (dismissTimer) clearTimeout(dismissTimer);
    };
  }, [showNotification, currentNotification, handleNotificationClose]);

  // Enhanced visibility control
  useEffect(() => {
    if (showNotification) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [showNotification]);

  // Extract tracking ID from success messages
  const extractTrackingId = (message) => {
    const trackingMatch = message?.match(/Tracking ID:\s*(TK-[A-Z0-9]+)/);
    return trackingMatch ? trackingMatch[1] : null;
  };

  // Handle view ticket navigation
  const handleViewTicket = () => {
    const trackingId = extractTrackingId(currentNotification?.message);
    if (trackingId) {
      handleNotificationClose();
      navigate('/track-ticket', { 
        state: { 
          prefilledTrackingId: trackingId,
          fromNotification: true 
        } 
      });
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <SuccessIcon sx={{ fontSize: '1.5rem' }} />;
      case 'error':
        return <ErrorIcon sx={{ fontSize: '1.5rem' }} />;
      case 'warning':
        return <WarningIcon sx={{ fontSize: '1.5rem' }} />;
      default:
        return <InfoIcon sx={{ fontSize: '1.5rem' }} />;
    }
  };

  // Get notification colors
  const getNotificationColors = (type) => {
    switch (type) {
      case 'success':
        return {
          primary: '#10b981',
          secondary: '#065f46',
          background: 'rgba(16, 185, 129, 0.05)',
          border: 'rgba(16, 185, 129, 0.2)'
        };
      case 'error':
        return {
          primary: '#ef4444',
          secondary: '#991b1b',
          background: 'rgba(239, 68, 68, 0.05)',
          border: 'rgba(239, 68, 68, 0.2)'
        };
      case 'warning':
        return {
          primary: '#f59e0b',
          secondary: '#92400e',
          background: 'rgba(245, 158, 11, 0.05)',
          border: 'rgba(245, 158, 11, 0.2)'
        };
      default:
        return {
          primary: '#3b82f6',
          secondary: '#1e40af',
          background: 'rgba(59, 130, 246, 0.05)',
          border: 'rgba(59, 130, 246, 0.2)'
        };
    }
  };

  const trackingId = extractTrackingId(currentNotification?.message);
  const colors = getNotificationColors(currentNotification?.type);
  const isSuccessWithTracking = currentNotification?.type === 'success' && trackingId;

  return (
    <Snackbar
      open={showNotification}
      onClose={handleNotificationClose}
      anchorOrigin={{ 
        vertical: 'center', 
        horizontal: 'center' 
      }}
      sx={{
        zIndex: 9999,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        right: 0,
        bottom: 0,
        transform: 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}
    >
      <Fade in={isVisible} timeout={300}>
        <Paper
          elevation={4}
          sx={{
            minWidth: { xs: 280, sm: 350 },
            maxWidth: { xs: '90vw', sm: 450 },
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.98)',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(8px)',
            overflow: 'hidden',
            position: 'relative',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Simple Header with icon and close button */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderBottom: `1px solid ${colors.border}`
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5
              }}
            >
              <Box
                sx={{
                  color: colors.primary
                }}
              >
                {getNotificationIcon(currentNotification?.type)}
              </Box>
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  color: colors.secondary,
                  fontSize: '0.95rem'
                }}
              >
                {currentNotification?.type === 'success' ? 'Success' : 
                 currentNotification?.type === 'error' ? 'Error' :
                 currentNotification?.type === 'warning' ? 'Warning' : 'Info'}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={handleNotificationClose}
              sx={{
                color: '#64748b'
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Message content */}
          <Box sx={{ px: 2, py: 2 }}>
            <Typography 
              variant="body1" 
              sx={{ 
                fontFamily: 'Poppins',
                color: '#1e293b',
                fontSize: '0.9rem',
                lineHeight: 1.5
              }}
            >
              {currentNotification?.message}
            </Typography>
          </Box>

          {/* Action buttons for success notifications with tracking ID */}
          {isSuccessWithTracking && (
            <Box
              sx={{
                px: 2,
                pb: 2,
                display: 'flex',
                justifyContent: 'flex-start'
              }}
            >
              <Button
                variant="contained"
                size="small"
                startIcon={<ViewIcon />}
                onClick={handleViewTicket}
                sx={{
                  textTransform: 'none',
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  borderRadius: 1.5,
                  backgroundColor: colors.primary,
                  '&:hover': {
                    backgroundColor: colors.secondary
                  }
                }}
              >
                View Ticket {trackingId}
              </Button>
            </Box>
          )}

          {/* Simple progress bar for auto-dismiss */}
          {currentNotification?.duration && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: 2,
                background: colors.primary,
                animation: `progressBar ${currentNotification.duration}ms linear`,
                '@keyframes progressBar': {
                  '0%': { width: '100%' },
                  '100%': { width: '0%' }
                }
              }}
            />
          )}
        </Paper>
      </Fade>
    </Snackbar>
  );
};

export default NotificationSystem; 