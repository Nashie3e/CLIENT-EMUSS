import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconButton,
  Badge,
  Menu,
  Typography,
  Box,
  Divider,
  CircularProgress,
  List,
  ListItem,
  Button,
  Chip,
  Slider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Build as BuildIcon,
  AccountCircle as AccountCircleIcon,
  Upload as UploadIcon,
  Support as SupportIcon,
  Flag as FlagIcon,
  VolumeUp as VolumeUpIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { createSocketConnection, authenticateSocket } from '../../utils/socketConfig';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to create authenticated axios instance
const createAuthAxios = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

// Category configurations
const CATEGORY_CONFIG = {
  TROUBLESHOOTING: {
    icon: <BuildIcon fontSize="small" />,
    color: '#2196F3', // Blue
    label: 'Troubleshooting'
  },
  ACCOUNT_MANAGEMENT: {
    icon: <AccountCircleIcon fontSize="small" />,
    color: '#4CAF50', // Green
    label: 'Account Management'
  },
  DOCUMENT_UPLOAD: {
    icon: <UploadIcon fontSize="small" />,
    color: '#FF9800', // Orange
    label: 'Document Upload'
  },
  TECHNICAL_ASSISTANCE: {
    icon: <SupportIcon fontSize="small" />,
    color: '#9C27B0', // Purple
    label: 'Technical Assistance'
  }
};

// Priority configurations
const PRIORITY_CONFIG = {
  HIGH: {
    color: '#f44336', // Red
    label: 'High Priority'
  },
  MEDIUM: {
    color: '#fb8c00', // Orange
    label: 'Medium Priority'
  },
  LOW: {
    color: '#4caf50', // Green
    label: 'Low Priority'
  }
};

const NotificationIcon = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  // Update to use existing notification sound file
  const notificationSoundRef = useRef(new Audio('/Notification.wav'));
  // Add state for sound notifications setting
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('notificationSoundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  // Add volume control state
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem('notificationVolume');
    return savedVolume !== null ? parseFloat(savedVolume) : 0.5;
  });
  
  // Effect to update audio volume when volume state changes
  useEffect(() => {
    notificationSoundRef.current.volume = volume;
    localStorage.setItem('notificationVolume', volume.toString());
  }, [volume]);

  // Effect to save sound setting changes
  useEffect(() => {
    localStorage.setItem('notificationSoundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    // Initialize socket connection using the new utility
    const newSocket = createSocketConnection();

    // Authenticate socket connection
    authenticateSocket(newSocket);

    // Handle authentication confirmation
    newSocket.on('authenticated', (data) => {
      console.log('Socket authentication status:', data);
    });

    // Listen for new notifications
    newSocket.on('newNotification', (notification) => {
      console.log('New notification received:', notification);
      setNotifications(prev => [notification, ...prev]);
      
      // Play notification sound if enabled
      if (soundEnabled) {
        try {
          // Clone the audio to allow multiple sounds to play simultaneously
          const sound = notificationSoundRef.current.cloneNode();
          sound.volume = volume;
          sound.play().catch(err => {
            console.warn('Could not play notification sound:', err.message);
          });
        } catch (error) {
          console.warn('Error playing notification sound:', error);
        }
      }
      
      // Show browser notification if enabled
      if (Notification.permission === 'granted') {
        // Create a more descriptive notification message based on the type
        let notificationTitle = 'New Notification';
        let notificationBody = '';
        
        if (notification.type === 'NEW_TICKET') {
          notificationTitle = 'New Ticket';
          notificationBody = `New ${notification.ticket?.category || ''} ticket from ${notification.ticket?.email || 'Unknown'}`;
        } else if (notification.type === 'TICKET_UPDATE') {
          notificationTitle = 'Ticket Updated';
          notificationBody = notification.message || 'A ticket has been updated';
        } else {
          notificationBody = notification.message || 'You have a new notification';
        }
        
        new Notification(notificationTitle, {
          body: notificationBody,
          icon: '/deped-logo.png'
        });
      }
    });

    // Listen for notification updates
    newSocket.on('updateNotification', (updatedNotification) => {
      console.log('Notification update received:', updatedNotification);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === updatedNotification.id ? updatedNotification : notif
        )
      );
    });

    // Store socket in state
    setSocket(newSocket);

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [soundEnabled, volume]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await createAuthAxios().get('/admin/notifications');
      setNotifications(response.data.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Remove the polling interval since we're using sockets now
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await createAuthAxios().put(`/admin/notifications/${parseInt(notificationId)}/read`);
      // Refresh notifications
      fetchNotifications();
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleClearAll = async () => {
    try {
      await createAuthAxios().post('/admin/notifications/clear-all');
      setNotifications([]);
      
      // Use socket to emit local event for clearing
      if (socket) {
        socket.emit('localClearNotifications');
      }
      
      handleClose();
    } catch (err) {
      console.error('Error clearing notifications:', err);
    }
  };

  const handleNotificationClick = async (notification) => {
    // If the notification has a ticketId, navigate to that ticket's details
    if (notification.ticketId) {
      // Mark as read before navigating
      if (!notification.read) {
        await handleMarkAsRead(parseInt(notification.id));
      }
      handleClose();
      navigate(`/admin/tickets/${notification.ticketId}`);
    }
  };


  const getCategoryChip = (category) => {
    const config = CATEGORY_CONFIG[category];
    if (!config) return null;

    return (
      <Chip
        icon={config.icon}
        label={config.label}
        size="small"
        sx={{
          backgroundColor: `${config.color}15`,
          color: config.color,
          '& .MuiChip-icon': {
            color: config.color
          },
          fontSize: '0.75rem',
          height: '24px'
        }}
      />
    );
  };

  const getPriorityChip = (priority) => {
    const config = PRIORITY_CONFIG[priority];
    if (!config) return null;

    return (
      <Chip
        icon={<FlagIcon fontSize="small" />}
        label={config.label}
        size="small"
        sx={{
          backgroundColor: `${config.color}15`,
          color: config.color,
          '& .MuiChip-icon': {
            color: config.color
          },
          fontSize: '0.75rem',
          height: '24px',
          ml: 1
        }}
      />
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Add a function to play test sound
  const playTestSound = () => {
    if (soundEnabled) {
      try {
        // Clone the audio to allow playing while another sound is playing
        const sound = notificationSoundRef.current.cloneNode();
        sound.volume = volume;
        sound.play().catch(err => {
          console.warn('Could not play test notification sound:', err.message);
        });
      } catch (error) {
        console.warn('Error playing test notification sound:', error);
      }
    }
  };

  // Add sound settings menu
  const [showSoundSettings, setShowSoundSettings] = useState(false);

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{
          mr: 2,
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.1)',
          }
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 360,
            maxHeight: 500,
            overflowY: 'auto',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Poppins' }}>
            Notifications
          </Typography>
        </Box>
        
        {/* Sound settings collapsible section */}
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => setShowSoundSettings(!showSoundSettings)}
          >
            <Typography variant="subtitle2" sx={{ fontFamily: 'Poppins' }}>
              Sound Settings
            </Typography>
            <FormControlLabel
              control={
                <Switch 
                  checked={soundEnabled}
                  onChange={(e) => {
                    e.stopPropagation(); // Prevent menu toggle
                    setSoundEnabled(e.target.checked);
                  }}
                  size="small"
                />
              }
              label=""
              onClick={(e) => e.stopPropagation()}
              sx={{ m: 0 }}
            />
          </Box>
          
          {showSoundSettings && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <VolumeUpIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Slider
                  disabled={!soundEnabled}
                  value={volume}
                  onChange={(_, newValue) => setVolume(newValue)}
                  min={0}
                  max={1}
                  step={0.01}
                  sx={{ flex: 1 }}
                />
              </Box>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={playTestSound}
                disabled={!soundEnabled}
                sx={{ fontFamily: 'Poppins', mt: 1 }}
                fullWidth
              >
                Test Sound
              </Button>
            </Box>
          )}
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Box sx={{ p: 2 }}>
            <Typography color="error" sx={{ fontFamily: 'Poppins' }}>{error}</Typography>
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary" sx={{ fontFamily: 'Poppins' }}>
              No notifications
            </Typography>
          </Box>
        ) : (
          <>
            <List sx={{ py: 0 }}>
              {notifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  sx={{
                    bgcolor: notification.read ? 'transparent' : 'rgba(25, 118, 210, 0.04)',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.04)',
                      cursor: notification.ticketId ? 'pointer' : 'default',
                    },
                    py: 1,
                    px: 2,
                  }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: notification.read ? 400 : 600,
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontFamily: 'Poppins'
                        }}
                      >
                        {notification.ticket?.email || 'No email provided'}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 1
                    }}>
                      {notification.ticket?.category && getCategoryChip(notification.ticket.category)}
                      {notification.priority && getPriorityChip(notification.priority)}
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
            <Divider />
            <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Button size="small" onClick={handleClearAll} sx={{ fontFamily: 'Poppins' }}>
                Clear all
              </Button>
            </Box>
          </>
        )}
      </Menu>
    </>
  );
};

export default NotificationIcon; 