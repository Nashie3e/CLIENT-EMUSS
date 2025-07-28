import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Chip,
  Tabs,
  Tab,
  Snackbar,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
} from '@mui/material';
import {
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Archive as ArchiveIcon,
  Unarchive as UnarchiveIcon,
  InboxOutlined as InboxIcon,
  SearchOff as SearchOffIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { createSocketConnection, authenticateSocket } from '../../utils/socketConfig';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Constants
const STATUS_STYLES = {
  PENDING: { color: '#ed6c02', backgroundColor: '#fff4e5', borderColor: '#ed6c02' },
  IN_PROGRESS: { color: '#0288d1', backgroundColor: '#e3f2fd', borderColor: '#0288d1' },
  RESOLVED: { color: '#2e7d32', backgroundColor: '#edf7ed', borderColor: '#2e7d32' },
  CLOSED: { color: '#616161', backgroundColor: '#f5f5f5', borderColor: '#616161' }
};

const PRIORITY_STYLES = {
  HIGH: { color: '#d32f2f', backgroundColor: '#ffeaea', borderColor: '#d32f2f', fontWeight: 600 },
  MEDIUM: { color: '#ed6c02', backgroundColor: '#fff4e5', borderColor: '#ed6c02' },
  LOW: { color: '#2e7d32', backgroundColor: '#edf7ed', borderColor: '#2e7d32' }
};

const OVERDUE_LEVELS = {
  URGENT: { hours: 48, level: 2, label: 'URGENT', color: '#d32f2f', backgroundColor: '#ffebee', icon: '🚨' },
  OVERDUE: { hours: 24, level: 1, label: 'OVERDUE', color: '#ff9800', backgroundColor: '#fff3e0', icon: '⚠️' }
};

// Custom TabPanel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tickets-tabpanel-${index}`}
      aria-labelledby={`tickets-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ManageTickets = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Consolidated state
  const [state, setState] = useState({
    tickets: [],
    loading: true,
    error: null,
    page: 0,
    rowsPerPage: 10,
    totalTickets: 0,
    categoryFilter: '',
    searchQuery: '',
    tabValue: 0,
    socket: null
  });

  // Dialog states
  const [dialogs, setDialogs] = useState({
    status: { open: false, ticket: null, newStatus: '' },
    delete: { open: false, ticket: null }
  });
  
  // Notification state
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Utility functions
  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  const getOverdueLevel = (ticket) => {
    if (ticket.status !== 'PENDING') return 0;
    
    const now = new Date();
    const createdDate = new Date(ticket.createdAt);
    const updatedDate = new Date(ticket.updatedAt || ticket.createdAt);
    const lastActionDate = updatedDate > createdDate ? updatedDate : createdDate;
    const hoursSinceLastAction = (now - lastActionDate) / (1000 * 60 * 60);
    
    if (hoursSinceLastAction > OVERDUE_LEVELS.URGENT.hours) return 2;
    if (hoursSinceLastAction > OVERDUE_LEVELS.OVERDUE.hours) return 1;
    return 0;
  };

  const getOverdueStyle = (ticket) => {
    const level = getOverdueLevel(ticket);
    const styles = {
      2: { borderLeft: '4px solid #d32f2f', backgroundColor: '#ffebee', '&:hover': { backgroundColor: '#ffcdd2' } },
      1: { borderLeft: '4px solid #ff9800', backgroundColor: '#fff3e0', '&:hover': { backgroundColor: '#ffe0b2' } }
    };
    return styles[level] || {};
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const updateDialogs = (dialogType, updates) => {
    setDialogs(prev => ({ ...prev, [dialogType]: { ...prev[dialogType], ...updates } }));
  };

  // Socket setup
  useEffect(() => {
    const newSocket = createSocketConnection();
    authenticateSocket(newSocket);

    const socketEvents = {
      connect: () => console.log('Socket connected successfully', newSocket.id),
      authenticated: (response) => {
      console.log('Socket authentication response:', response);
      if (!response.success) {
          updateState({ error: `Socket authentication failed: ${response.message}` });
          showNotification(`Real-time updates not available: ${response.message}`, 'warning');
      }
      },
      connect_error: (error) => {
      console.error('Socket connection error:', error);
        updateState({ error: 'Failed to connect to notification service' });
      },
      disconnect: (reason) => {
      console.log('Socket disconnected:', reason);
        if (reason === 'io server disconnect') newSocket.connect();
      },
      ticketUpdated: (updatedTicket) => {
        setState(prevState => {
          const { tickets, tabValue, categoryFilter } = prevState;
          const ticketIndex = tickets.findIndex(t => t.id === updatedTicket.id);
          const newTickets = [...tickets];
        
        if (ticketIndex !== -1) {
            const shouldRemoveFromActive = tabValue === 0 && (updatedTicket.status === 'RESOLVED' || updatedTicket.status === 'CLOSED');
            const shouldRemoveFromResolved = tabValue === 1 && (updatedTicket.status !== 'RESOLVED' && updatedTicket.status !== 'CLOSED');
            
            if (shouldRemoveFromActive || shouldRemoveFromResolved) {
              newTickets.splice(ticketIndex, 1);
              return { ...prevState, tickets: newTickets, totalTickets: Math.max(0, prevState.totalTickets - 1) };
            } else {
              // Check if updated ticket still matches current filters
              const matchesCategoryFilter = !categoryFilter || updatedTicket.category === categoryFilter;
              
              if (matchesCategoryFilter) {
                newTickets[ticketIndex] = updatedTicket;
                return { ...prevState, tickets: newTickets };
              } else {
                // Remove ticket if it no longer matches filters
            newTickets.splice(ticketIndex, 1);
                return { ...prevState, tickets: newTickets, totalTickets: Math.max(0, prevState.totalTickets - 1) };
              }
            }
          }
          
          // Add ticket if it matches current view and filters
          const shouldAddToActive = tabValue === 0 && updatedTicket.status !== 'RESOLVED' && updatedTicket.status !== 'CLOSED';
          const shouldAddToResolved = tabValue === 1 && (updatedTicket.status === 'RESOLVED' || updatedTicket.status === 'CLOSED');
          const matchesCategoryFilter = !categoryFilter || updatedTicket.category === categoryFilter;
          
          if ((shouldAddToActive || shouldAddToResolved) && matchesCategoryFilter) {
            return { 
              ...prevState, 
              tickets: [updatedTicket, ...tickets], 
              totalTickets: prevState.totalTickets + 1 
            };
          }
          
          return prevState;
        });
        showNotification(`Ticket #${updatedTicket.id} was updated to ${updatedTicket.status.replace('_', ' ').toLowerCase()}`, 'info');
      },
      newTicket: (newTicket) => {
        setState(prevState => {
          const { tickets, tabValue, categoryFilter } = prevState;
      
          // Only add to active tab and check all filters
          const shouldAdd = tabValue === 0 && newTicket.status !== 'RESOLVED' && newTicket.status !== 'CLOSED';
          const matchesCategoryFilter = !categoryFilter || newTicket.category === categoryFilter;
          const ticketExists = tickets.some(ticket => ticket.id === newTicket.id);
            
          if (shouldAdd && matchesCategoryFilter && !ticketExists) {
            showNotification(`New ticket #${newTicket.id} has been created`, 'success');
            return { 
              ...prevState, 
              tickets: [newTicket, ...tickets], 
              totalTickets: prevState.totalTickets + 1 
            };
          }
          return prevState;
        });
      },
      ticketDeleted: (data) => {
        if (!data?.id) return;
        setState(prevState => ({
          ...prevState,
          tickets: prevState.tickets.filter(t => t.id !== data.id),
          totalTickets: Math.max(0, prevState.totalTickets - 1)
        }));
        showNotification(`Ticket #${data.id} was deleted successfully`, 'info');
      }
    };

    Object.entries(socketEvents).forEach(([event, handler]) => {
      newSocket.on(event, handler);
    });

    updateState({ socket: newSocket });

    return () => {
      console.log('Cleaning up socket connection');
      newSocket?.disconnect();
    };
  }, [state.tabValue, state.categoryFilter]);

  // Fetch tickets
  const fetchTickets = useCallback(async () => {
    try {
      updateState({ loading: true });
      const token = localStorage.getItem('token');
      
      if (!token) throw new Error('No authentication token found');

      const params = new URLSearchParams({
        page: state.page + 1,
        limit: state.rowsPerPage,
        ...(state.categoryFilter && { category: state.categoryFilter }),
        ...(state.searchQuery && { search: state.searchQuery })
      });
      
      // Handle tab-specific filtering
      if (state.tabValue === 0) {
        // Active tickets tab - exclude resolved and closed
        params.append('excludeResolved', 'true');
      } else {
        // Resolved tickets tab - show both RESOLVED and CLOSED
        params.append('status', 'RESOLVED');
        params.append('status', 'CLOSED');
      }

      const response = await axios.get(`${API_BASE_URL}/admin/tickets?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        updateState({
          tickets: response.data.data.tickets,
          totalTickets: response.data.data.pagination.total,
          error: null
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load tickets';
      updateState({ error: errorMessage });
      showNotification(errorMessage, 'error');
    } finally {
      updateState({ loading: false });
    }
  }, [state.page, state.rowsPerPage, state.categoryFilter, state.searchQuery, state.tabValue]);

  // Event handlers
  const handleTabChange = (event, newValue) => {
    updateState({ tabValue: newValue, page: 0 });
  };

  const handleStatusUpdate = async (ticket, newStatus) => {
    try {
      updateState({ loading: true });
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE_URL}/admin/tickets/${ticket.id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setState(prevState => {
          const { tickets, tabValue } = prevState;
          const shouldRemoveFromActive = tabValue === 0 && (newStatus === 'RESOLVED' || newStatus === 'CLOSED');
          const shouldRemoveFromResolved = tabValue === 1 && (newStatus !== 'RESOLVED' && newStatus !== 'CLOSED');
          
          if (shouldRemoveFromActive || shouldRemoveFromResolved) {
            return { ...prevState, tickets: tickets.filter(t => t.id !== ticket.id) };
          } else {
            return { ...prevState, tickets: tickets.map(t => t.id === ticket.id ? { ...t, status: newStatus } : t) };
          }
        });
        
        updateDialogs('status', { open: false, ticket: null, newStatus: '' });
        showNotification(`Ticket status updated to ${newStatus.toLowerCase().replace('_', ' ')}`, 'success');
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update ticket status';
      updateState({ error: errorMessage });
      showNotification(errorMessage, 'error');
    } finally {
      updateState({ loading: false });
    }
  };

  const handleDeleteTicket = async () => {
    if (!dialogs.delete.ticket) return;
    
    try {
      updateState({ loading: true });
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${API_BASE_URL}/admin/tickets/${dialogs.delete.ticket.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const ticketId = dialogs.delete.ticket.id;
        setState(prevState => ({
          ...prevState,
          tickets: prevState.tickets.filter(t => t.id !== ticketId),
          totalTickets: Math.max(0, prevState.totalTickets - 1)
        }));
        
        updateDialogs('delete', { open: false, ticket: null });
        showNotification(`Ticket #${ticketId} was deleted successfully`, 'success');
        
        // Emit manual notification if socket exists
        if (state.socket) {
          state.socket.emit('manualDeleteNotification', { id: ticketId });
        }
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete ticket';
      updateState({ error: errorMessage });
      showNotification(errorMessage, 'error');
      updateDialogs('delete', { open: false, ticket: null });
    } finally {
      updateState({ loading: false });
    }
  };

  // Filter handlers
  const handleFilterChange = (filterType, value) => {
    updateState({ [filterType]: value, page: 0 });
  };

  const clearAllFilters = () => {
    updateState({ categoryFilter: '', searchQuery: '', page: 0 });
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => updateState({ page: newPage });
  const handleChangeRowsPerPage = (event) => {
    updateState({ rowsPerPage: parseInt(event.target.value, 10), page: 0 });
  };

  // Navigation
  const handleTicketClick = (ticketId) => navigate(`/admin/tickets/${ticketId}`);

  // Dialog handlers
  const openStatusDialog = (ticket) => {
    updateDialogs('status', { open: true, ticket, newStatus: ticket.status });
  };

  const closeStatusDialog = () => {
    updateDialogs('status', { open: false, ticket: null, newStatus: '' });
  };

  const openDeleteDialog = (ticket, e) => {
    e.stopPropagation();
    updateDialogs('delete', { open: true, ticket });
  };

  const closeDeleteDialog = () => {
    updateDialogs('delete', { open: false, ticket: null });
  };

  // Fetch tickets effect
  useEffect(() => {
    const debounceTimer = setTimeout(fetchTickets, 500);
    return () => clearTimeout(debounceTimer);
  }, [state.page, state.rowsPerPage, state.categoryFilter, state.searchQuery, state.tabValue, fetchTickets]);

  // Sort tickets by priority and overdue status
  const sortedTickets = [...state.tickets].sort((a, b) => {
    const overdueA = getOverdueLevel(a);
    const overdueB = getOverdueLevel(b);
    
    if (overdueA !== overdueB) return overdueB - overdueA;
    
    const priorityRanking = { HIGH: 1, MEDIUM: 2, LOW: 3 };
    return (priorityRanking[a.priority] || 4) - (priorityRanking[b.priority] || 4);
  });

  // Render overdue badge
  const renderOverdueBadge = (ticket) => {
    const level = getOverdueLevel(ticket);
    if (level === 0) return null;
    
    const config = level === 2 ? OVERDUE_LEVELS.URGENT : OVERDUE_LEVELS.OVERDUE;
    
    return (
            <Chip
        label={`${config.icon} ${config.label}`}
              size="small"
              sx={{
          color: config.color,
          backgroundColor: config.backgroundColor,
          borderColor: config.color,
                borderWidth: '1px',
                borderStyle: 'solid',
          fontWeight: 600,
                height: '20px',
          animation: level === 2 ? 'pulse 2s infinite' : 'none',
          '@keyframes pulse': {
            '0%': { opacity: 1 },
            '50%': { opacity: 0.7 },
            '100%': { opacity: 1 },
          },
          '& .MuiChip-label': { px: 1, fontSize: '0.6rem' }
        }}
      />
    );
  };

  // Render filters
  const renderFilters = () => (
    <Box sx={{ 
          mb: 3, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2, 
          flexWrap: 'wrap',
          backgroundColor: 'white',
          p: { xs: 2, sm: 3 },
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'relative',
      zIndex: 10,
      '& .MuiInputLabel-root, & .MuiSelect-select, & .MuiMenuItem-root, & .MuiInputBase-input': {
            fontFamily: 'Poppins'
      }
    }}>


      <FormControl sx={{ 
        minWidth: { xs: '100%', sm: 200 },
          '& .MuiSelect-select': {
          cursor: 'pointer'
          },
        '& .MuiOutlinedInput-root': {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976d2'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976d2',
            borderWidth: '2px'
          }
        }
      }}>
        <InputLabel id="category-filter-label">Category</InputLabel>
            <Select
          labelId="category-filter-label"
          id="category-filter-select"
          value={state.categoryFilter}
          label="Category"
          onChange={(e) => handleFilterChange('categoryFilter', e.target.value)}
          MenuProps={{
            PaperProps: {
              sx: {
                maxHeight: 300,
                zIndex: 1300,
                '& .MuiMenuItem-root': {
                  fontFamily: 'Poppins',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)'
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(25, 118, 210, 0.12)',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.16)'
                    }
                  }
                }
              }
            },
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left'
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left'
            }
          }}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0, 0, 0, 0.23)' 
            },
            '& .MuiSelect-icon': {
              color: '#1976d2'
              }
            }}
          >
          <MenuItem value="">
            <em>All Categories</em>
          </MenuItem>
            <MenuItem value="TROUBLESHOOTING">Troubleshooting</MenuItem>
            <MenuItem value="ACCOUNT_MANAGEMENT">Account Management</MenuItem>
            <MenuItem value="DOCUMENT_UPLOAD">Document Upload</MenuItem>
            <MenuItem value="TECHNICAL_ASSISTANCE">Technical Assistance</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Search"
          variant="outlined"
        value={state.searchQuery}
        onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          placeholder="Search by subject, message, or user..."
          sx={{ 
            minWidth: { xs: '100%', sm: 300 },
          '& .MuiOutlinedInput-root': {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1976d2'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1976d2',
              borderWidth: '2px'
            }
          },
            '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0, 0, 0, 0.23)' 
            }
          }}
        />

      {(state.categoryFilter || state.searchQuery) && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<ClearIcon />}
            onClick={clearAllFilters}
              sx={{
                height: '56px',
                fontFamily: 'Poppins',
                textTransform: 'none',
              flex: { xs: '1', sm: '0 0 auto' },
              '&:hover': {
                backgroundColor: 'rgba(211, 47, 47, 0.04)',
                borderColor: '#d32f2f'
              }
              }}
            >
              Clear All
            </Button>
          )}
        </Box>
  );

  // Render tickets table
  const renderTicketsTable = () => (
    <>
      {renderFilters()}

      {state.tickets.length > 0 ? (
        <>
          {/* Mobile Card View */}
          {isMobile && (
            <Box sx={{ mb: 2 }}>
              {sortedTickets.map(renderTicketCard)}
            </Box>
          )}

          {/* Desktop Table View */}
          {!isMobile && (
            <TableContainer 
              component={Paper}
              sx={{ 
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                mb: 2,
                '& .MuiTableCell-root': {
                  fontFamily: 'Poppins',
                  px: { sm: 1, md: 2 },
                  py: { sm: 1, md: 1.5 },
                  whiteSpace: isTablet ? 'nowrap' : 'normal'
                },
                '& .MuiChip-label': { fontFamily: 'Poppins' }
              }}
            >
              <Table size={isTablet ? "small" : "medium"}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                    {['ID', 'Tracking ID', 'Category', 'Status', 'Priority', 'Created date', 'Actions'].map((header) => (
                      <TableCell key={header} sx={{ fontWeight: 600, color: '#1976d2' }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedTickets.map((ticket) => (
                    <TableRow 
                      key={ticket.id}
                      onClick={() => handleTicketClick(ticket.id)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#f8fafc' },
                        ...getOverdueStyle(ticket)
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>{ticket.id}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace', color: '#1976d2' }}>{ticket.trackingId}</TableCell>
                      <TableCell>
                        <Box sx={{ fontWeight: 500 }}>
                          {ticket.category.replace(/_/g, ' ')}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Chip
                            label={ticket.status.replace(/_/g, ' ')}
                            size="small"
                            sx={{
                              ...STATUS_STYLES[ticket.status],
                              fontWeight: 500,
                              borderWidth: '1px',
                              borderStyle: 'solid'
                            }}
                          />
                          {renderOverdueBadge(ticket)}
                        </Box>
                      </TableCell>
                      <TableCell>
                          <Chip
                            label={ticket.priority}
                            size="small"
                            sx={{
                            ...PRIORITY_STYLES[ticket.priority],
                              borderWidth: '1px',
                              borderStyle: 'solid'
                            }}
                          />
                      </TableCell>
                      <TableCell sx={{ color: '#666' }}>{formatDate(ticket.createdAt)}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title={state.tabValue === 1 ? "Restore Ticket" : "Mark as Resolved"}>
                            <IconButton 
                              onClick={() => handleStatusUpdate(ticket, state.tabValue === 1 ? 'IN_PROGRESS' : 'RESOLVED')}
                              sx={{ color: '#2e7d32', '&:hover': { backgroundColor: 'rgba(46, 125, 50, 0.04)' } }}
                              size={isTablet ? "small" : "medium"}
                            >
                              {state.tabValue === 1 ? 
                                <UnarchiveIcon fontSize={isTablet ? "small" : "medium"} /> : 
                                <ArchiveIcon fontSize={isTablet ? "small" : "medium"} />
                              }
                              </IconButton>
                            </Tooltip>
                              
                          <Tooltip title="Delete Ticket">
                            <IconButton 
                              onClick={(e) => openDeleteDialog(ticket, e)}
                              sx={{ color: '#d32f2f', '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.04)' } }}
                              size={isTablet ? "small" : "medium"}
                            >
                              <DeleteIcon fontSize={isTablet ? "small" : "medium"} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination */}
          <TablePagination
            component={Paper}
            count={state.totalTickets}
            page={state.page}
            onPageChange={handleChangePage}
            rowsPerPage={state.rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={isMobile ? [5, 10] : [5, 10, 25, 50]}
            sx={{
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '& .MuiTablePagination-select': { fontWeight: 500 },
              '& .MuiTablePagination-selectLabel': { display: { xs: 'none', sm: 'block' } },
              '& .MuiTablePagination-displayedRows': { fontFamily: 'Poppins' }
            }}
          />
        </>
      ) : (
        renderEmptyState()
      )}
    </>
  );

  // Render empty state
  const renderEmptyState = () => {
    const isFiltering = state.categoryFilter || state.searchQuery;
    
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 6, sm: 10 },
        px: { xs: 2, sm: 4 },
        bgcolor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        my: 2
      }}>
        {isFiltering ? (
          <SearchOffIcon sx={{ fontSize: { xs: 70, sm: 100 }, color: '#bdbdbd', mb: 2 }} />
        ) : (
          <InboxIcon sx={{ fontSize: { xs: 70, sm: 100 }, color: '#bdbdbd', mb: 2 }} />
        )}
        
        <Typography variant="h5" align="center" sx={{ 
          fontWeight: 600, mb: 1, color: '#424242', fontFamily: 'Poppins',
          fontSize: { xs: '1.1rem', sm: '1.5rem' }
        }}>
          {isFiltering ? 'No matching tickets found' : 'No tickets yet'}
        </Typography>
        
        <Typography variant="body1" align="center" sx={{ 
          color: '#757575', mb: 3, maxWidth: 500, fontFamily: 'Poppins',
          fontSize: { xs: '0.85rem', sm: '1rem' }
        }}>
          {isFiltering 
            ? 'Try adjusting your search criteria or clearing your filters to see more results.' 
            : state.tabValue === 0 
              ? 'There are currently no active tickets in the system.'
              : 'There are currently no resolved tickets in the system.'
          }
        </Typography>
        
        {isFiltering && (
          <Button
            variant="outlined"
            onClick={clearAllFilters}
        sx={{
              textTransform: 'none',
            fontFamily: 'Poppins',
              borderRadius: '8px',
              fontWeight: 500,
              px: { xs: 3, sm: 4 }
          }}
        >
            Clear all filters
          </Button>
        )}
      </Box>
    );
  };

  // Render ticket card for mobile
  const renderTicketCard = (ticket) => (
    <Card 
      key={ticket.id} 
      onClick={() => handleTicketClick(ticket.id)}
      sx={{ 
        mb: 2, 
        borderRadius: 2,
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        },
        border: '1px solid',
        borderColor: 'divider',
        ...getOverdueStyle(ticket)
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, fontFamily: 'Poppins', fontSize: '0.9rem' }}>
              Ticket #{ticket.id}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#1976d2', fontSize: '0.8rem' }}>
              {ticket.trackingId}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
            {renderOverdueBadge(ticket)}
            <Chip
              label={ticket.priority}
              size="small"
        sx={{ 
                ...PRIORITY_STYLES[ticket.priority],
                borderWidth: '1px',
                borderStyle: 'solid',
                height: '20px',
                '& .MuiChip-label': { px: 1, fontSize: '0.65rem' }
              }}
            />
            <Chip
              label={ticket.status.replace(/_/g, ' ')}
              size="small"
              sx={{
                ...STATUS_STYLES[ticket.status],
                fontWeight: 500,
                borderWidth: '1px',
                borderStyle: 'solid',
                height: '20px',
                '& .MuiChip-label': { px: 1, fontSize: '0.65rem' }
              }}
            />
          </Box>
        </Box>
        
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', fontFamily: 'Poppins' }}>
            Category
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'Poppins', fontSize: '0.85rem' }}>
            {ticket.category.replace(/_/g, ' ')}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', fontFamily: 'Poppins' }}>
            Created
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 400, fontFamily: 'Poppins', fontSize: '0.8rem', color: '#666' }}>
            {formatDate(ticket.createdAt)}
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          borderTop: '1px dashed',
          borderColor: 'rgba(0,0,0,0.1)',
          pt: 1.5,
          mt: 1
        }}
        onClick={(e) => e.stopPropagation()}
        >
          {state.tabValue === 0 && (
            <Tooltip title="Update Status">
              <IconButton 
                onClick={() => openStatusDialog(ticket)}
                size="small"
                sx={{ color: '#1976d2', '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' } }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          
          <Tooltip title={state.tabValue === 1 ? "Restore Ticket" : "Mark as Resolved"}>
            <IconButton 
              onClick={() => handleStatusUpdate(ticket, state.tabValue === 1 ? 'IN_PROGRESS' : 'RESOLVED')}
              size="small"
              sx={{ color: '#2e7d32', '&:hover': { backgroundColor: 'rgba(46, 125, 50, 0.04)' }, ml: 1 }}
            >
              {state.tabValue === 1 ? <UnarchiveIcon fontSize="small" /> : <ArchiveIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Delete Ticket">
            <IconButton 
              onClick={(e) => openDeleteDialog(ticket, e)}
              size="small"
              sx={{ color: '#d32f2f', '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.04)' }, ml: 1 }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );

  if (state.loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px" sx={{ p: { xs: 2, sm: 4 } }}>
        <CircularProgress size={isMobile ? 40 : 50} />
        <Typography variant="body1" sx={{ fontFamily: 'Poppins', mt: 2, color: 'text.secondary', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          Loading tickets...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{
            fontWeight: 700,
            fontFamily: 'Poppins',
            background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}>
          Manage Tickets
        </Typography>
          
          {/* Overdue tickets summary */}
          {state.tabValue === 0 && state.tickets.length > 0 && (
            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {(() => {
                const urgentCount = state.tickets.filter(t => getOverdueLevel(t) === 2).length;
                const overdueCount = state.tickets.filter(t => getOverdueLevel(t) === 1).length;
                
                return (
                  <>
                    {urgentCount > 0 && (
                      <Chip
                        label={`🚨 ${urgentCount} Urgent Ticket${urgentCount > 1 ? 's' : ''}`}
                        size="small"
                        sx={{
                          color: '#d32f2f',
                          backgroundColor: '#ffebee',
                          borderColor: '#d32f2f',
                          borderWidth: '1px',
                          borderStyle: 'solid',
                          fontWeight: 600,
                          animation: 'pulse 2s infinite',
                          '@keyframes pulse': {
                            '0%': { opacity: 1 },
                            '50%': { opacity: 0.7 },
                            '100%': { opacity: 1 },
                          }
                        }}
                      />
                    )}
                    {overdueCount > 0 && (
                      <Chip
                        label={`⚠️ ${overdueCount} Overdue Ticket${overdueCount > 1 ? 's' : ''}`}
                        size="small"
                        sx={{
                          color: '#ff9800',
                          backgroundColor: '#fff3e0',
                          borderColor: '#ff9800',
                          borderWidth: '1px',
                          borderStyle: 'solid',
                          fontWeight: 600
                        }}
                      />
                    )}
                  </>
                );
              })()}
            </Box>
          )}
        </Box>
        
        <Tooltip title="Refresh List">
          <IconButton 
            onClick={fetchTickets} 
            disabled={state.loading}
            sx={{
              bgcolor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Error Alert */}
      {state.error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '8px', '& .MuiAlert-icon': { color: '#d32f2f' } }}>
          {state.error}
        </Alert>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={state.tabValue} 
          onChange={handleTabChange}
          variant={isMobile ? "fullWidth" : "standard"}
          sx={{
            '& .MuiTab-root': {
              fontSize: { xs: '0.875rem', sm: '1rem' },
              textTransform: 'none',
              fontWeight: 500,
              minWidth: 120,
              fontFamily: 'Poppins'
            },
            '& .Mui-selected': { color: '#1976d2', fontWeight: 600 },
            '& .MuiTabs-indicator': { backgroundColor: '#1976d2' },
          }}
        >
          <Tab label="Active Tickets" />
          <Tab label="Resolved Tickets" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={state.tabValue} index={0}>
        {renderTicketsTable()}
      </TabPanel>

      <TabPanel value={state.tabValue} index={1}>
        {renderTicketsTable()}
      </TabPanel>

      {/* Status Update Dialog */}
      <Dialog 
        open={dialogs.status.open} 
        onClose={closeStatusDialog}
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            '& .MuiDialogTitle-root': { fontFamily: 'Poppins', fontWeight: 600, color: '#1976d2' },
            '& .MuiInputLabel-root, & .MuiSelect-select, & .MuiMenuItem-root, & .MuiButton-root': { fontFamily: 'Poppins' }
          }
        }}
      >
        <DialogTitle>Update Ticket Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>New Status</InputLabel>
            <Select
              value={dialogs.status.newStatus}
              label="New Status"
              onChange={(e) => updateDialogs('status', { newStatus: e.target.value })}
              sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 0, 0, 0.1)' } }}
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="RESOLVED">Resolved</MenuItem>
              <MenuItem value="CLOSED">Closed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeStatusDialog} sx={{ color: '#666', '&:hover': { backgroundColor: '#f5f5f5' } }}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleStatusUpdate(dialogs.status.ticket, dialogs.status.newStatus)} 
            variant="contained" 
            sx={{
              background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
              '&:hover': { background: 'linear-gradient(135deg, #1565c0, #1976d2)' }
            }}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={dialogs.delete.open}
        onClose={closeDeleteDialog}
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            '& .MuiDialogTitle-root': { fontFamily: 'Poppins', fontWeight: 600, color: '#d32f2f' },
            '& .MuiDialogContentText-root, & .MuiButton-root': { fontFamily: 'Poppins' }
          }
        }}
      >
        <DialogTitle>Confirm Ticket Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete ticket #{dialogs.delete.ticket?.id} ({dialogs.delete.ticket?.trackingId})? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeDeleteDialog} sx={{ color: '#666', '&:hover': { backgroundColor: '#f5f5f5' } }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteTicket} variant="contained" color="error" sx={{ '&:hover': { backgroundColor: '#c62828' } }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: isMobile ? 'bottom' : 'bottom', horizontal: isMobile ? 'center' : 'right' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          variant="filled"
          sx={{ 
            width: isMobile ? '90%' : '100%',
            fontFamily: 'Poppins',
            '& .MuiAlert-message': { fontFamily: 'Poppins', fontSize: { xs: '0.8rem', sm: '0.875rem' } }
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageTickets; 