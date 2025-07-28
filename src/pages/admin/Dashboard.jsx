import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useMediaQuery,
  useTheme,
  Stack,
} from '@mui/material';
import {
  ConfirmationNumber as TicketIcon,
  CheckCircle as ResolvedIcon,
  Pending as PendingIcon,
  Speed as SpeedIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  Autorenew as ProgressIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { createSocketConnection, authenticateSocket } from '../../utils/socketConfig';
import SystemManagement from './SystemManagement';


const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const COLORS = {
  primary: '#1976d2',
  success: '#2e7d32',
  warning: '#ed6c02',
  error: '#d32f2f',
  info: '#0288d1',
  progress: '#9c27b0',
  secondary: '#651fff',
};

const StatCard = ({ title, value, icon, color, subtitle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: isMobile ? 'none' : 'translateY(-4px) scale(1.02)',
          boxShadow: `0 12px 28px ${color}25`,
          backgroundColor: `${color}05`,
        },
        borderRadius: { xs: 2, sm: 3 },
        overflow: 'visible',
        border: `1px solid ${color}15`,
      }}
    >
      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
        {/* Icon Section */}
        <Box
          sx={{
            backgroundColor: `${color}15`,
            borderRadius: { xs: 1.5, sm: 2 },
            p: { xs: 0.75, sm: 1 },
            display: 'inline-flex',
            mb: 1.5,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, ${color}30, transparent)`,
              borderRadius: 'inherit',
              zIndex: 0,
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {React.cloneElement(icon, { 
              sx: { 
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                color: color,
              }
            })}
          </Box>
        </Box>

        {/* Title Section */}
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary',
            fontWeight: 500,
            mb: 0.5,
            textTransform: 'uppercase',
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            letterSpacing: '0.5px',
            fontFamily: 'Poppins'
          }}
        >
          {title}
        </Typography>

        {/* Value Section */}
        <Typography 
          variant="h3" 
          sx={{ 
            color: 'text.primary',
            fontWeight: 600,
            mb: subtitle ? 0.5 : 0,
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            lineHeight: 1.2,
            background: `linear-gradient(45deg, ${color}, ${color}99)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Poppins'
          }}
        >
          {value}
        </Typography>

        {/* Subtitle Section */}
        {subtitle && (
          <>
            <Divider sx={{ my: 1, opacity: 0.1 }} />
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                display: 'block',
                fontWeight: 500,
                fontFamily: 'Poppins'
              }}
            >
              {subtitle}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalTickets: 0,
    pendingTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    ictCoorUsers: 0,
    responseTimeMetrics: {
      averageResponseTime: 0
    }
  });
  const [timeRange, setTimeRange] = useState('7days');
  const [socket, setSocket] = useState(null);
  const appVersion = process.env.REACT_APP_VERSION || '0.0.1 BETA';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Create authenticated axios instance
  const createAuthAxios = useCallback(() => {
      const token = localStorage.getItem('token');
    return axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
      });
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await createAuthAxios().get(`/admin/stats?time_range=${timeRange}`);

      if (response.data.success) {
        setStats(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch dashboard statistics');
      }
    } catch (err) {
      console.error('Error fetching dashboard statistics:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  }, [timeRange, createAuthAxios]);

  // Set up socket connection
  useEffect(() => {
    const newSocket = createSocketConnection();

    // Authenticate socket connection
    authenticateSocket(newSocket);

    // Listen for ticket updates
    newSocket.on('ticketUpdated', (updatedTicket) => {
      console.log('Ticket updated event received:', updatedTicket);
      // Refresh stats when a ticket is updated
      fetchStats();
    });

    // Listen for new tickets
    newSocket.on('newTicket', (newTicket) => {
      console.log('New ticket event received in Dashboard:', newTicket);
      // Refresh stats when a new ticket is created
      fetchStats();
    });

    // Listen for ticket deletions
    newSocket.on('ticketDeleted', (data) => {
      console.log('Ticket deleted event received:', data);
      // Refresh stats when a ticket is deleted
      fetchStats();
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [fetchStats]);

  // Fetch initial data and set up regular polling
  useEffect(() => {
    fetchStats();

    // Set up polling every 5 minutes
    const intervalId = setInterval(() => {
      fetchStats();
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [fetchStats]);

  // Handle time range change
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  // Handle refresh button click
  const handleRefresh = () => {
    fetchStats();
    
    // Use socket to emit refresh event
    if (socket) {
      socket.emit('manualDashboardRefresh', { timeRange });
    }
  };

  const resolutionRate = ((stats.resolvedTickets / (stats.totalTickets || 1)) * 100).toFixed(1);

  const renderDashboard = () => (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        width: '100%',
        p: { xs: 1.5, sm: 2 },
        backgroundColor: '#f5f7fa',
        borderRadius: { xs: 2, sm: 4 },
      }}
    >
      <Stack 
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2 }}
        sx={{ 
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          mb: 2
        }}
      >
        <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={handleTimeRangeChange}
            size="small"
            sx={{ 
              fontFamily: 'Poppins',
              '& .MuiSelect-select': { fontFamily: 'Poppins' }
            }}
          >
            <MenuItem value="24hours">Last 24 Hours</MenuItem>
            <MenuItem value="7days">Last 7 Days</MenuItem>
            <MenuItem value="30days">Last 30 Days</MenuItem>
            <MenuItem value="90days">Last 90 Days</MenuItem>
          </Select>
        </FormControl>
        
        <Tooltip title="Refresh Data">
          <IconButton 
            onClick={handleRefresh} 
            disabled={loading}
            sx={{ 
              bgcolor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': { bgcolor: '#f5f5f5' },
              alignSelf: { xs: 'flex-end', sm: 'auto' }
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <Grid 
        container 
        spacing={{ xs: 1.5, sm: 2 }}
        justifyContent="center"
      >
        {/* First Row */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Tickets"
            value={stats.totalTickets}
            icon={<TicketIcon />}
            color={COLORS.primary}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Pending"
            value={stats.pendingTickets}
            icon={<PendingIcon />}
            color={COLORS.warning}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Progress"
            value={stats.inProgressTickets}
            icon={<ProgressIcon />}
            color={COLORS.progress}
          />
        </Grid>
        
        {/* Second Row */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Resolved"
            value={stats.resolvedTickets}
            icon={<ResolvedIcon />}
            color={COLORS.success}
            subtitle={`${resolutionRate}% Resolution Rate`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Response Time"
            value={`${stats.responseTimeMetrics.averageResponseTime}h`}
            icon={<SpeedIcon />}
            color={COLORS.info}
            subtitle="Average Response Time"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="ICT COOR Users"
            value={stats.ictCoorUsers || 0}
            icon={<PersonIcon />}
            color={COLORS.secondary}
            subtitle="Total ICT Coordinators"
          />
        </Grid>
      </Grid>
    </Box>
  );

  if (loading && !stats.totalTickets) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box 
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        p: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        gap: { xs: 2, sm: 0 },
        mb: 3,
        backgroundColor: '#ffffff',
        p: { xs: 1.5, sm: 2 },
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <Typography 
          variant="h4" 
          color="text.primary" 
          sx={{ 
            fontFamily: 'Poppins',
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
          }}
        >
          {view === 'dashboard' ? 'Analytics Dashboard' : 'System Management'}
        </Typography>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(e, newView) => newView && setView(newView)}
          aria-label="dashboard view"
          size={isMobile ? "small" : "medium"}
          sx={{ 
            '& .MuiToggleButton-root': { 
              fontFamily: 'Poppins',
              px: { xs: 1, sm: 2 },
              py: { xs: 0.5, sm: 0.75 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            } 
          }}
        >
          <ToggleButton value="dashboard" aria-label="dashboard view">
            <DashboardIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: '1rem', sm: '1.25rem' } }} /> 
            {isMobile ? '' : 'Dashboard'}
          </ToggleButton>
          <ToggleButton value="management" aria-label="management view">
            <SettingsIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: '1rem', sm: '1.25rem' } }} /> 
            {isMobile ? '' : 'System Management'}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            fontFamily: 'Poppins'
          }}
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={handleRefresh}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}

      {view === 'dashboard' ? renderDashboard() : <SystemManagement />}

      {/* Version display in footer */}
      <Box sx={{ width: '100%', textAlign: 'center', mt: 'auto', mb: 1, py: 1 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            fontFamily: 'Poppins',
            color: 'text.secondary',
            fontStyle: 'italic' 
          }}
        >
          version {appVersion}
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard; 