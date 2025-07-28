import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Avatar,
  CssBaseline,
  Container
} from '@mui/material';
import {
  Menu as MenuIcon,
  ExitToApp as ExitToAppIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Description as DescriptionIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationIcon from '../components/admin/NotificationIcon';

const drawerWidth = 260;

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Tickets', icon: <InventoryIcon />, path: '/admin/tickets' },
    { text: 'Reports', icon: <DescriptionIcon />, path: '/admin/reports' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f7fa', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: '100%',
          bgcolor: '#1976d2',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: '64px', px: { xs: 1, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h5" 
              component={Link} 
              to="/admin/dashboard"
            sx={{ 
              fontWeight: 600,
                color: '#ffffff',
                fontFamily: 'Poppins, sans-serif',
                textDecoration: 'none'
            }}
          >
            Ticket System
          </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
          <NotificationIcon />
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<ExitToAppIcon />}
            sx={{
              ml: 2,
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.2)',
              },
              borderRadius: '8px',
              textTransform: 'none',
                px: 2,
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                display: { xs: 'none', sm: 'flex' }
            }}
          >
            Logout
          </Button>
            <IconButton
              color="inherit"
              onClick={handleLogout}
              sx={{
                ml: 1,
                display: { xs: 'flex', sm: 'none' }
              }}
            >
              <ExitToAppIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
              boxSizing: 'border-box',
              bgcolor: '#ffffff',
              borderRight: '1px solid rgba(0,0,0,0.08)',
            fontFamily: 'Poppins, sans-serif',
            boxShadow: 'none',
            pt: 8, // This ensures the drawer content starts below the AppBar
            },
          }}
        >
        {/* User Profile */}
          <Box sx={{ 
          px: 3,
          py: 2, 
            display: 'flex', 
            alignItems: 'center', 
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}>
          <Avatar
            sx={{ 
              width: 40, 
              height: 40, 
            bgcolor: '#1976d2',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </Avatar>
          <Box sx={{ ml: 2 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600, 
                fontSize: '0.9rem', 
                color: '#333',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              {user?.name || 'Admin User'}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: '0.75rem', 
                color: '#666',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              {user?.role === 'ADMIN' ? 'Administrator' : user?.role === 'STAFF' ? 'ICT Coordinator' : user?.role || 'Administrator'}
            </Typography>
          </Box>
        </Box>

        {/* Navigation Menu */}
        <Box sx={{ px: 3, py: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{
              mb: 2,
              color: '#666',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            MAIN MENU
          </Typography>
          <List component="nav" sx={{ p: 0 }}>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 1, display: 'block' }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    borderRadius: '8px',
                    py: 1.5,
                    px: 2,
                    '&.Mui-selected': {
                      backgroundColor: '#1976d2',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#1565c0',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                    },
                    '&:hover': {
                      backgroundColor: location.pathname === item.path 
                        ? '#1565c0' 
                        : 'rgba(25, 118, 210, 0.08)',
                    },
                    transition: 'all 0.2s',
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      minWidth: 36,
                      color: location.pathname === item.path ? 'white' : '#1976d2'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          </Box>
        </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          bgcolor: '#f5f7fa',
          fontFamily: 'Poppins, sans-serif'
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 3 } }}>
        <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default AdminLayout; 