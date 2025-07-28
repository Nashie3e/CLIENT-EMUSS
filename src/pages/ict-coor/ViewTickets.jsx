import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  TextField,
  Select,
  MenuItem,
  ButtonGroup,
  Grid,
  InputAdornment,
  IconButton,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Link
} from '@mui/material';
import {
  PriorityHigh as HighPriorityIcon,
  Timeline as MediumPriorityIcon,
  LowPriority as LowPriorityIcon,
  FileDownload as FileDownloadIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Notifications as NotificationsIcon,
  VpnKey as KeyIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  Computer as ComputerIcon,
  Build as BuildIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import * as XLSX from 'xlsx';
import { createSocketConnection, authenticateSocket } from '../../utils/socketConfig';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Global sx styles for consistent font usage
const fontStyles = {
  fontFamily: 'Poppins, sans-serif',
};

// Define global styles for animations
const globalAnimations = {
  '@keyframes shine': {
    '100%': {
      transform: 'translateX(100%)'
    }
  },
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0
    },
    '100%': {
      opacity: 1
    }
  }
};

const ViewTickets = () => {
  const { user, loading: authLoading, error: authError } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [locationInfo, setLocationInfo] = useState(null);
  const [selectedCategories] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const appVersion = process.env.REACT_APP_VERSION || '0.0.1 BETA';
  
  // Notification sound state
  const notificationSoundRef = useRef(new Audio('/Notification.wav'));
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('ictCoorNotificationSoundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Password change state
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Predefined categories
  const ticketCategories = [
    'TROUBLESHOOTING',
    'ACCOUNT_MANAGEMENT',
    'DOCUMENT_UPLOAD',
    'TECHNICAL_ASSISTANCE'
  ];

  // Effect to save sound setting changes
  useEffect(() => {
    localStorage.setItem('ictCoorNotificationSoundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  // Effect to initialize socket connection
  useEffect(() => {
    // Initialize socket connection
    const newSocket = createSocketConnection();

    // Authenticate socket connection
    authenticateSocket(newSocket);

    // Handle authentication confirmation
    newSocket.on('authenticated', (data) => {
      console.log('Socket authentication status:', data);
      
      if (!data.success) {
        console.warn('Socket authentication failed:', data.message);
        setError(`Real-time updates unavailable: ${data.message}`);
      } else {
        console.log(`Socket authenticated as ${data.role}`);
      }
    });

    // Listen for new tickets
    newSocket.on('newTicket', async (ticketData) => {
      console.log('New ticket received:', ticketData);
      
      // Make sure ticket has a details property
      if (!ticketData.details) {
        ticketData.details = {};
      }
      
      // Make sure ticket has a properly formatted requester object
      if (!ticketData.requester) {
        const details = ticketData.categorySpecificDetails?.details || {};
        ticketData.requester = {
          name: ticketData.name || details.requesterName || 'Unknown',
          email: ticketData.email || details.requesterEmail || 'No email provided',
          department: details.department
        };
      }
      
      // Only update if the ticket belongs to the staff's location
      if (user?.locationId && ticketData.locationId === user.locationId) {
        // Update ticket list with the new ticket
        setTickets(prev => [ticketData, ...prev]);
        
        // Show notification
        setNotificationMessage(`New ${ticketData.category} ticket received`);
        setNotificationOpen(true);
        
        // Play notification sound if enabled
        if (soundEnabled) {
          try {
            const sound = notificationSoundRef.current.cloneNode();
            sound.play().catch(err => {
              console.warn('Could not play notification sound:', err.message);
            });
          } catch (error) {
            console.warn('Error playing notification sound:', error);
          }
        }

        // Send email notification
        try {
          // Format the ticket details properly for the email
          const formattedDetails = {
            // Pass all ticket details fields directly 
            ...ticketData.details,
            // Add fields that might be missing but needed for the email template
            typeOfEquipment: ticketData.details?.typeOfEquipment || '',
            modelOfEquipment: ticketData.details?.modelOfEquipment || '',
            serialNo: ticketData.details?.serialNo || '',
            specificProblem: ticketData.details?.specificProblem || ''
          };

          console.log('Sending ticket details to email API:', {
            ticketId: ticketData.id,
            staffEmail: user.email,
            trackingId: ticketData.trackingId,
            category: ticketData.category,
            details: formattedDetails
          });
          
          const response = await fetch(`${API_BASE_URL}/staff/send-ticket-email`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ticketId: ticketData.id,
              staffEmail: user.email,
              ticketDetails: {
                trackingId: ticketData.trackingId,
                category: ticketData.category,
                requester: ticketData.requester?.name || 'Unknown',
                requesterEmail: ticketData.requester?.email || '',
                priority: ticketData.priority,
                status: ticketData.status,
                location: locationInfo?.name,
                details: formattedDetails
              }
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to send email notification');
          }

          console.log('Email notification sent successfully to staff');
        } catch (error) {
          console.error('Error sending email notification:', error);
          // Don't throw the error to prevent the UI from breaking
          // Just log it and continue
        }
      }
    });

    // Listen for ticket updates
    newSocket.on('ticketUpdated', (updatedTicket) => {
      console.log('Ticket update received:', updatedTicket);
      
      // Make sure ticket has a details property
      if (!updatedTicket.details) {
        updatedTicket.details = {};
      }
      
      // Make sure ticket has a properly formatted requester object
      if (!updatedTicket.requester) {
        const details = updatedTicket.categorySpecificDetails?.details || {};
        updatedTicket.requester = {
          name: updatedTicket.name || details.requesterName || 'Unknown',
          email: updatedTicket.email || details.requesterEmail || 'No email provided',
          department: details.department
        };
      }
      
      // Only update if the ticket belongs to the staff's location
      if (user?.locationId && updatedTicket.locationId === user.locationId) {
        // Update the ticket in the list
        setTickets(prev => 
          prev.map(ticket => 
            ticket.id === updatedTicket.id ? updatedTicket : ticket
          )
        );
        
        // Show notification
        setNotificationMessage(`Ticket #${updatedTicket.id} has been updated`);
        setNotificationOpen(true);
        
        // Play notification sound if enabled
        if (soundEnabled) {
          try {
            const sound = notificationSoundRef.current.cloneNode();
            sound.play().catch(err => {
              console.warn('Could not play notification sound:', err.message);
            });
          } catch (error) {
            console.warn('Error playing notification sound:', error);
          }
        }
      }
    });

    // Listen for ticket deletion
    newSocket.on('ticketDeleted', (deletedTicketId) => {
      console.log('Ticket deletion received:', deletedTicketId);
      
      // Remove the deleted ticket from the list
      setTickets(prev => prev.filter(ticket => ticket.id !== deletedTicketId));
      
      // Show notification
      setNotificationMessage(`Ticket #${deletedTicketId} has been deleted`);
      setNotificationOpen(true);
    });

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [user, soundEnabled, locationInfo?.name]);

  // Handle notification close
  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  // Toggle sound notifications
  const handleToggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  useEffect(() => {
    if (!authLoading) {
      if (authError) {
        setError(authError);
        setLoading(false);
      } else if (!user?.locationId) {
        setError('You are not assigned to any location. Please contact your administrator.');
        setLoading(false);
      } else {
        fetchTickets();
      }
    }
  }, [authLoading, user, authError]);

  // Add a new useEffect to retrieve the selected ticket from localStorage on component mount
  useEffect(() => {
    const storedTicket = localStorage.getItem('selectedTicket');
    if (storedTicket) {
      try {
        const parsedTicket = JSON.parse(storedTicket);
        setSelectedTicket(parsedTicket);
        if (localStorage.getItem('viewDetailsOpen') === 'true') {
          setViewDetailsOpen(true);
        }
      } catch (error) {
        console.error('Error parsing stored ticket:', error);
        localStorage.removeItem('selectedTicket');
        localStorage.removeItem('viewDetailsOpen');
      }
    }
  }, []);

  // Helper function for ticket search
  const ticketMatchesSearch = (ticket, searchStr) => {
    if (!searchStr) return true;
    
    return (
      (ticket.id?.toString() || '').includes(searchStr) ||
      (ticket.trackingId || '').toLowerCase().includes(searchStr) ||
      (ticket.category || '').toLowerCase().includes(searchStr) ||
      (ticket.requester?.name || '').toLowerCase().includes(searchStr) ||
      (ticket.requester?.email || '').toLowerCase().includes(searchStr) ||
      (ticket.priority || '').toLowerCase().includes(searchStr) ||
      (ticket.status || '').toLowerCase().includes(searchStr) ||
      (ticket.details?.specificProblem || '').toLowerCase().includes(searchStr) ||
      (ticket.details?.documentSubject || '').toLowerCase().includes(searchStr) ||
      (ticket.details?.subject || '').toLowerCase().includes(searchStr) ||
      (ticket.details?.message || '').toLowerCase().includes(searchStr) ||
      (ticket.details?.documentMessage || '').toLowerCase().includes(searchStr) ||
      (ticket.details?.typeOfEquipment || '').toLowerCase().includes(searchStr) ||
      (ticket.details?.modelOfEquipment || '').toLowerCase().includes(searchStr) ||
      (ticket.details?.serialNo || '').toLowerCase().includes(searchStr) ||
      (ticket.details?.accountType || '').toLowerCase().includes(searchStr) ||
      (ticket.details?.actionType || '').toLowerCase().includes(searchStr) ||
      (ticket.details?.taType || '').toLowerCase().includes(searchStr) ||
      (ticket.details?.documentType || '').toLowerCase().includes(searchStr)
    );
  };

  useEffect(() => {
    // Filter tickets based on search query
    const searchStr = searchQuery.toLowerCase();
    const filtered = tickets.filter(ticket => ticketMatchesSearch(ticket, searchStr));
    setFilteredTickets(filtered);
    setPage(0); // Reset to first page when search changes
  }, [searchQuery, tickets]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/staff/assigned`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch tickets');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch tickets');
      }
      
      // Ensure all tickets have a details property
      const ticketsWithDetails = data.data.map(ticket => {
        if (!ticket.details) {
          ticket.details = {};
        }
        return ticket;
      });
      
      setTickets(ticketsWithDetails);
      setLocationInfo(data.location);

      // Check if there's a stored selectedTicket id and find it in the new ticket list
      const storedTicket = localStorage.getItem('selectedTicket');
      if (storedTicket) {
        try {
          const parsedTicket = JSON.parse(storedTicket);
          const refreshedTicket = ticketsWithDetails.find(ticket => ticket.id === parsedTicket.id);
          if (refreshedTicket) {
            setSelectedTicket(refreshedTicket);
            if (localStorage.getItem('viewDetailsOpen') === 'true') {
              setViewDetailsOpen(true);
            }
          }
        } catch (error) {
          console.error('Error parsing stored ticket:', error);
          localStorage.removeItem('selectedTicket');
          localStorage.removeItem('viewDetailsOpen');
        }
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
      if (err.message === 'Failed to fetch') {
        setError('Cannot connect to server. Please check if the server is running.');
      } else {
        setError(err.message || 'Failed to fetch tickets');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'HIGH':
        return <HighPriorityIcon sx={{ 
          color: '#d32f2f',
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(1)',
              filter: 'drop-shadow(0 0 0 rgba(211, 47, 47, 0.5))'
            },
            '50%': {
              transform: 'scale(1.1)',
              filter: 'drop-shadow(0 0 3px rgba(211, 47, 47, 0.7))'
            },
            '100%': {
              transform: 'scale(1)',
              filter: 'drop-shadow(0 0 0 rgba(211, 47, 47, 0.5))'
            }
          }
        }} />;
      case 'MEDIUM':
        return <MediumPriorityIcon sx={{ 
          color: '#ed6c02',
          animation: 'pulse 3s infinite',
          '@keyframes pulse': {
            '0%': {
              filter: 'drop-shadow(0 0 0 rgba(237, 108, 2, 0.3))'
            },
            '50%': {
              filter: 'drop-shadow(0 0 2px rgba(237, 108, 2, 0.5))'
            },
            '100%': {
              filter: 'drop-shadow(0 0 0 rgba(237, 108, 2, 0.3))'
            }
          }
        }} />;
      case 'LOW':
        return <LowPriorityIcon sx={{ color: '#2e7d32' }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'IN_PROGRESS':
        return 'info';
      case 'RESOLVED':
        return 'success';
      case 'CLOSED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusGradient = (status) => {
    switch (status) {
      case 'PENDING':
        return 'linear-gradient(135deg, #ffb74d, #ff9800)';
      case 'IN_PROGRESS':
        return 'linear-gradient(135deg, #64b5f6, #2196f3)';
      case 'RESOLVED':
        return 'linear-gradient(135deg, #81c784, #4caf50)';
      case 'CLOSED':
        return 'linear-gradient(135deg, #e57373, #f44336)';
      default:
        return 'linear-gradient(135deg, #e0e0e0, #9e9e9e)';
    }
  };

  const handleExportModalOpen = () => {
    setExportModalOpen(true);
  };

  const handleExportModalClose = () => {
    setExportModalOpen(false);
  };

  const handleDateShortcut = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    setDateRange({
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    });
  };

  const handleStatusChange = (event) => {
    setSelectedStatuses(event.target.value);
  };

  const exportToExcel = () => {
    // Filter tickets based on date range and categories
    const filteredTickets = tickets.filter(ticket => {
      const ticketDate = new Date(ticket.createdAt);
      const startDate = dateRange.startDate ? new Date(dateRange.startDate) : null;
      const endDate = dateRange.endDate ? new Date(dateRange.endDate) : null;
      
      const dateInRange = (!startDate || ticketDate >= startDate) && 
                         (!endDate || ticketDate <= endDate);
      
      const categoryMatch = ticketCategories.length === 0 || 
                          ticketCategories.includes(ticket.category);
      
      const statusMatch = selectedStatuses.length === 0 || 
                         selectedStatuses.includes(ticket.status);

      return dateInRange && categoryMatch && statusMatch;
    });

    // Get category specific field mapping
    const getCategoryDetail = (ticket, field) => {
      switch (ticket.category) {
        case 'TROUBLESHOOTING':
          switch (field) {
            case 'subcategory': return ticket.details?.typeOfEquipment || '';
            case 'description': return ticket.details?.specificProblem || '';
            default: return '';
          }
        case 'ACCOUNT_MANAGEMENT':
          switch (field) {
            case 'subcategory': return ticket.details?.accountType || '';
            case 'description': return ticket.details?.actionType || '';
            default: return '';
          }
        case 'DOCUMENT_UPLOAD':
          switch (field) {
            case 'subcategory': return ticket.details?.documentType || '';
            case 'description': return ticket.details?.documentSubject || '';
            default: return '';
          }
        case 'TECHNICAL_ASSISTANCE':
          switch (field) {
            case 'subcategory': return ticket.details?.taType || '';
            case 'description': return ticket.details?.subject || '';
            default: return '';
          }
        default:
          return '';
      }
    };

    // Prepare data for export
    const exportData = filteredTickets.map(ticket => ({
      'Ticket ID': ticket.id,
      'Tracking ID': ticket.trackingId || '',
      'Category': ticket.category || '',
      'Sub Category': getCategoryDetail(ticket, 'subcategory'),
      'Description': getCategoryDetail(ticket, 'description'),
      'Requester Name': ticket.requester?.name || 'Unknown',
      'Requester Email': ticket.requester?.email || 'No email provided',
      'Priority': ticket.priority || '',
      'Status': ticket.status || '',
      'Created At': ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '',
      'Location': locationInfo?.name || 'Unknown',
      'Location Type': locationInfo?.type || 'Unknown',
      'Message': ticket.details?.message || ticket.details?.documentMessage || '',
      'File Attachment': ticket.details?.fileName || ''
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const colWidths = [
      { wch: 10 }, // Ticket ID
      { wch: 15 }, // Tracking ID
      { wch: 20 }, // Category
      { wch: 20 }, // Sub Category
      { wch: 25 }, // Requester Name
      { wch: 30 }, // Requester Email
      { wch: 15 }, // Priority
      { wch: 15 }, // Status
      { wch: 15 }, // Created At
      { wch: 25 }, // Location
      { wch: 20 }, // Location Type
      { wch: 20 }, // Message
      { wch: 20 }, // File Attachment
    ];
    ws['!cols'] = colWidths;

    // Add header styling
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "1976D2" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" }
      }
    };

    // Apply header styling to all header cells
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[cellRef]) continue;
      ws[cellRef].s = headerStyle;
    }

    // Add alternating row colors
    for (let R = 1; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellRef]) continue;
        ws[cellRef].s = {
          fill: { fgColor: { rgb: R % 2 === 0 ? "F5F5F5" : "FFFFFF" } },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }
          }
        };
      }
    }

    // Add filters to the worksheet
    ws['!autofilter'] = { ref: `A1:${XLSX.utils.encode_col(range.e.c)}${range.e.r + 1}` };

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tickets');

    // Generate Excel file
    const fileName = `ticket_logs_${locationInfo?.name || 'unknown'}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    handleExportModalClose();
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Filter tickets based on search query and filters
  const filterTickets = useCallback(() => {
    return tickets.filter(ticket => {
      const searchMatch = ticketMatchesSearch(ticket, searchQuery.toLowerCase());

      const { startDate, endDate } = dateRange;
      const ticketDate = new Date(ticket.createdAt);
      const dateMatch = (!startDate || ticketDate >= new Date(startDate)) &&
                       (!endDate || ticketDate <= new Date(endDate));
      
      const categoryMatch = selectedCategories.length === 0 || 
                       selectedCategories.includes(ticket.category);
      
      const statusMatch = selectedStatuses.length === 0 || 
                       selectedStatuses.includes(ticket.status);

      return searchMatch && dateMatch && categoryMatch && statusMatch;
    });
  }, [tickets, searchQuery, dateRange, selectedCategories, selectedStatuses]);

  // Update filtered tickets whenever filters change
  useEffect(() => {
    setFilteredTickets(filterTickets());
  }, [filterTickets]);

  // Handle password dialog open/close
  const handlePasswordDialogOpen = () => {
    setPasswordDialogOpen(true);
    setPasswordError('');
    setPasswordSuccess('');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handlePasswordDialogClose = () => {
    setPasswordDialogOpen(false);
  };

  // Handle password input changes
  const handlePasswordChange = (field) => (event) => {
    setPasswordData({
      ...passwordData,
      [field]: event.target.value
    });
    // Clear error when typing
    setPasswordError('');
  };

  // Toggle password visibility
  const handleTogglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  // Submit password change
  const handlePasswordSubmit = async () => {
    // Reset states
    setPasswordError('');
    setPasswordSuccess('');
    
    // Validate inputs
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/staff/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }
      
      setPasswordSuccess(data.message || 'Password changed successfully');
      
      // Clear form after successful change
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Close dialog after 2 seconds
      setTimeout(() => {
        handlePasswordDialogClose();
      }, 2000);
      
    } catch (err) {
      console.error('Error changing password:', err);
      setPasswordError(err.message || 'Failed to change password');
    }
  };

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setViewDetailsOpen(true);
    // Store the selected ticket in localStorage for persistence
    localStorage.setItem('selectedTicket', JSON.stringify(ticket));
    localStorage.setItem('viewDetailsOpen', 'true');
  };

  const handleCloseDetails = () => {
    setViewDetailsOpen(false);
    // Clear the viewDetailsOpen flag but keep the ticket for reference
    localStorage.removeItem('viewDetailsOpen');
  };

  // Helper function to highlight search text
  const highlightSearchText = (text, searchTerm) => {
    if (!searchTerm || !text) return text;
    
    const stringText = String(text);
    if (searchTerm.trim() === '') return stringText;
    
    // For case-insensitive search
    const searchTermLower = searchTerm.toLowerCase();
    const textLower = stringText.toLowerCase();
    
    if (!textLower.includes(searchTermLower)) return stringText;
    
    const index = textLower.indexOf(searchTermLower);
    const beforeMatch = stringText.substring(0, index);
    const match = stringText.substring(index, index + searchTerm.length);
    const afterMatch = stringText.substring(index + searchTerm.length);
    
    return (
      <>
        {beforeMatch}
        <span style={{ backgroundColor: '#ffff00', fontWeight: 'bold' }}>{match}</span>
        {afterMatch}
      </>
    );
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)',
        ...globalAnimations
      }}>
        <CircularProgress 
          size={60}
          thickness={4}
          sx={{
            color: 'primary.main',
            boxShadow: '0 0 20px rgba(25, 118, 210, 0.2)',
            animation: 'fadeIn 0.5s ease-out',
          }}
        />
        <Typography 
          variant="h6" 
          sx={{ 
            mt: 3, 
            color: 'text.secondary',
            fontFamily: 'Poppins',
            fontWeight: 500,
            animation: 'fadeIn 0.8s ease-out',
          }}
        >
          Loading tickets...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, ...fontStyles }}>
        <Alert severity="error" sx={fontStyles}>{error}</Alert>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#eef2f6',
        overflow: 'hidden',
        position: 'relative',
        animation: 'fadeIn 0.5s ease-out',
        ...globalAnimations,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '70%',
          height: '60%',
          background: 'radial-gradient(circle at 70% 30%, rgba(25, 118, 210, 0.15), transparent 60%)',
          zIndex: 0,
          pointerEvents: 'none',
        },
      }}
    >
      <Paper 
        elevation={0}
        sx={{ 
          width: '100%', 
          overflow: 'hidden',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          position: 'relative',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05), 0 1px 8px rgba(0, 0, 0, 0.1)',
          backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%)',
          backdropFilter: 'blur(10px)',
          zIndex: 1,
        }}
      >
        <Box 
          sx={{ 
            p: 3, 
            borderBottom: 1, 
            borderColor: 'divider', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            bgcolor: 'background.default',
            background: 'linear-gradient(135deg, rgba(240, 242, 245, 0.8) 0%, rgba(250, 252, 255, 0.9) 100%)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-50%',
              right: '-10%',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(25, 118, 210, 0.08), transparent 70%)',
              zIndex: 0,
            }
          }}
        >
          <Box>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600, 
                color: 'primary.main',
                ...fontStyles 
              }}
            >
              ICT COOR Dashboard
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: 'text.secondary',
                mt: 0.5,
                ...fontStyles 
              }}
            >
              {locationInfo?.name || 'Unknown Location'} - {locationInfo?.type} {locationInfo?.level ? `- ${locationInfo.level}` : ''}
              </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<KeyIcon />}
              onClick={handlePasswordDialogOpen}
              size="small"
              sx={{ 
                ...fontStyles, 
                borderColor: 'primary.main',
                color: 'primary.main',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -15,
                  left: -15,
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(25, 118, 210, 0.2), transparent 70%)',
                  transition: 'all 0.5s ease',
                },
                '&:hover': {
                  borderColor: 'primary.dark',
                  bgcolor: 'rgba(25, 118, 210, 0.05)',
                  color: 'primary.dark',
                  boxShadow: '0 4px 10px rgba(25, 118, 210, 0.15)',
                  transform: 'translateY(-2px)',
                  '&::before': {
                    transform: 'scale(1.2)',
                  }
                }
              }}
            >
              Change Password
            </Button>
            
            <Button
              variant="outlined"
              startIcon={soundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
              onClick={handleToggleSound}
              size="small"
              sx={{ 
                ...fontStyles, 
                borderColor: 'primary.main',
                color: 'primary.main',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -15,
                  left: -15,
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(25, 118, 210, 0.2), transparent 70%)',
                  transition: 'all 0.5s ease',
                },
                '&:hover': {
                  borderColor: 'primary.dark',
                  bgcolor: 'rgba(25, 118, 210, 0.05)',
                  color: 'primary.dark',
                  boxShadow: '0 4px 10px rgba(25, 118, 210, 0.15)',
                  transform: 'translateY(-2px)',
                  '&::before': {
                    transform: 'scale(1.2)',
                  }
                }
              }}
            >
              Sound {soundEnabled ? "On" : "Off"}
            </Button>
            
            <Button
              variant="contained"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportModalOpen}
              disabled={tickets.length === 0}
              size="small"
              sx={{
                ...fontStyles,
                bgcolor: 'primary.main',
                boxShadow: '0 4px 10px rgba(25, 118, 210, 0.2)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -10,
                  left: -30,
                  width: 60,
                  height: 100,
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                  transform: 'skewX(-20deg)',
                  transition: 'all 0.7s ease',
                  opacity: 0,
                },
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 15px rgba(25, 118, 210, 0.3)',
                  '&::before': {
                    left: '130%',
                    opacity: 1,
                  }
                }
              }}
            >
              Export to Excel
            </Button>
          </Box>
        </Box>
        
        {/* Search Bar */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <TextField
            fullWidth
            placeholder="Search tickets by ID, tracking ID, category, requester, priority, status, or description..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton 
                    onClick={handleClearSearch} 
                    edge="end"
                    size="small"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
              style: { ...fontStyles }
            }}
            inputProps={{ 
              style: { ...fontStyles },
              sx: { borderRadius: 2 }
            }}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                  background: 'rgba(255, 255, 255, 0.95)',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused': {
                  boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Box>

        {/* Export Settings Modal */}
        <Dialog 
          open={exportModalOpen} 
          onClose={handleExportModalClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { ...fontStyles }
          }}
        >
          <DialogTitle>
            <Typography variant="h6" sx={{ fontWeight: 600, ...fontStyles }}>
              Export Settings
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              {/* Date Range Section */}
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, ...fontStyles }}>
                Date Range
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Start Date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    InputLabelProps={{ shrink: true, sx: fontStyles }}
                    inputProps={{ style: { ...fontStyles } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="End Date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    InputLabelProps={{ shrink: true, sx: fontStyles }}
                    inputProps={{ style: { ...fontStyles } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ButtonGroup variant="outlined" size="small" sx={{ mt: 1 }}>
                    <Button onClick={() => handleDateShortcut(1)} sx={fontStyles}>Last 24h</Button>
                    <Button onClick={() => handleDateShortcut(7)} sx={fontStyles}>Last Week</Button>
                    <Button onClick={() => handleDateShortcut(30)} sx={fontStyles}>Last Month</Button>
                    <Button onClick={() => handleDateShortcut(365)} sx={fontStyles}>Last Year</Button>
                  </ButtonGroup>
                </Grid>
              </Grid>

              {/* Category Filter Section */}
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, ...fontStyles }}>
                Ticket Category
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {ticketCategories.map((category) => (
                      <FormControlLabel
                        key={category}
                        control={
                          <Checkbox
                            checked={ticketCategories.includes(category)}
                          />
                        }
                        label={category.replace(/_/g, ' ')}
                        sx={fontStyles}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>

              {/* Status Filter Section */}
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, ...fontStyles }}>
                Ticket Status
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Select
                    multiple
                    fullWidth
                    value={selectedStatuses}
                    onChange={handleStatusChange}
                    renderValue={(selected) => selected.join(', ')}
                    displayEmpty
                    inputProps={{ sx: fontStyles }}
                    MenuProps={{
                      PaperProps: {
                        sx: fontStyles
                      }
                    }}
                  >
                    <MenuItem disabled value="" sx={fontStyles}>
                      Select Statuses
                    </MenuItem>
                    {['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((status) => (
                      <MenuItem key={status} value={status} sx={fontStyles}>
                        <Checkbox checked={selectedStatuses.includes(status)} />
                        {status.replace(/_/g, ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleExportModalClose} sx={fontStyles}>Cancel</Button>
            <Button 
              onClick={exportToExcel} 
              variant="contained"
              sx={fontStyles}
            >
              Export
            </Button>
          </DialogActions>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog 
          open={passwordDialogOpen} 
          onClose={handlePasswordDialogClose}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: { ...fontStyles }
          }}
        >
          <DialogTitle>
            <Typography variant="h6" sx={{ fontWeight: 600, ...fontStyles }}>
              Change Password
            </Typography>
          </DialogTitle>
          <DialogContent>
            {passwordError && (
              <Alert severity="error" sx={{ mb: 2, mt: 1, ...fontStyles }}>
                {passwordError}
              </Alert>
            )}
            
            {passwordSuccess && (
              <Alert severity="success" sx={{ mb: 2, mt: 1, ...fontStyles }}>
                {passwordSuccess}
              </Alert>
            )}
            
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Current Password"
                type={showPassword.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={handlePasswordChange('currentPassword')}
                InputLabelProps={{ sx: fontStyles }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleTogglePasswordVisibility('current')}
                        edge="end"
                      >
                        {showPassword.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: { ...fontStyles }
                }}
              />
              
              <TextField
                fullWidth
                label="New Password"
                type={showPassword.new ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={handlePasswordChange('newPassword')}
                InputLabelProps={{ sx: fontStyles }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleTogglePasswordVisibility('new')}
                        edge="end"
                      >
                        {showPassword.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: { ...fontStyles }
                }}
              />
              
              <TextField
                fullWidth
                label="Confirm New Password"
                type={showPassword.confirm ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange('confirmPassword')}
                InputLabelProps={{ sx: fontStyles }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleTogglePasswordVisibility('confirm')}
                        edge="end"
                      >
                        {showPassword.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: { ...fontStyles }
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePasswordDialogClose} sx={fontStyles}>Cancel</Button>
            <Button 
              onClick={handlePasswordSubmit} 
              variant="contained"
              sx={fontStyles}
            >
              Change Password
            </Button>
          </DialogActions>
        </Dialog>

        <TableContainer sx={{ 
          maxHeight: 'calc(100vh - 250px)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(to top, rgba(255,255,255,0.8), transparent)',
            pointerEvents: 'none',
            zIndex: 1,
            opacity: 0.5,
          }
        }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    bgcolor: 'background.default',
                    color: 'primary.main',
                    background: 'linear-gradient(135deg, rgba(240, 245, 255, 0.95) 0%, rgba(230, 240, 250, 0.95) 100%)',
                    borderBottom: '2px solid',
                    borderColor: 'primary.light',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '2px',
                      background: 'linear-gradient(90deg, primary.light, transparent)',
                    },
                    ...fontStyles 
                  }}
                >
                  Ticket ID
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    bgcolor: 'background.default',
                    color: 'primary.main',
                    background: 'linear-gradient(135deg, rgba(240, 245, 255, 0.95) 0%, rgba(230, 240, 250, 0.95) 100%)',
                    ...fontStyles 
                  }}
                >
                  Tracking ID
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    bgcolor: 'background.default',
                    color: 'primary.main',
                    background: 'linear-gradient(135deg, rgba(240, 245, 255, 0.95) 0%, rgba(230, 240, 250, 0.95) 100%)',
                    ...fontStyles 
                  }}
                >
                  Category
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    bgcolor: 'background.default',
                    color: 'primary.main',
                    background: 'linear-gradient(135deg, rgba(240, 245, 255, 0.95) 0%, rgba(230, 240, 250, 0.95) 100%)',
                    ...fontStyles 
                  }}
                >
                  Requester
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    bgcolor: 'background.default',
                    color: 'primary.main',
                    background: 'linear-gradient(135deg, rgba(240, 245, 255, 0.95) 0%, rgba(230, 240, 250, 0.95) 100%)',
                    ...fontStyles 
                  }}
                >
                  Priority
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    bgcolor: 'background.default',
                    color: 'primary.main',
                    background: 'linear-gradient(135deg, rgba(240, 245, 255, 0.95) 0%, rgba(230, 240, 250, 0.95) 100%)',
                    ...fontStyles 
                  }}
                >
                  Status
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    bgcolor: 'background.default',
                    color: 'primary.main',
                    background: 'linear-gradient(135deg, rgba(240, 245, 255, 0.95) 0%, rgba(230, 240, 250, 0.95) 100%)',
                    ...fontStyles 
                  }}
                >
                  Created At
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="textSecondary" sx={fontStyles}>
                      {tickets.length === 0 
                        ? `No tickets found for ${locationInfo?.name || 'your location'}`
                        : 'No matching tickets found'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((ticket) => (
                    <TableRow 
                      hover 
                      key={ticket.id}
                      onClick={() => handleViewDetails(ticket)}
                      sx={{
                        position: 'relative',
                        transition: 'all 0.2s ease',
                        background: 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(8px)',
                        '&:nth-of-type(odd)': {
                          background: 'rgba(240, 245, 250, 0.5)',
                        },
                        '&:hover': {
                          bgcolor: 'rgba(25, 118, 210, 0.04)',
                          cursor: 'pointer',
                          boxShadow: 'inset 0 0 0 1px rgba(25, 118, 210, 0.1)',
                          '& td': {
                            color: 'primary.dark',
                          },
                          '&::after': {
                            opacity: 1,
                            transform: 'scaleX(1)',
                          }
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          width: '4px',
                          height: '100%',
                          background: 'linear-gradient(to bottom, primary.main, primary.light)',
                          opacity: 0,
                          transform: 'scaleX(0)',
                          transformOrigin: 'left',
                          transition: 'all 0.3s ease',
                        }
                      }}
                    >
                      <TableCell sx={fontStyles}>
                        #{highlightSearchText(ticket.id, searchQuery)}
                      </TableCell>
                      <TableCell sx={fontStyles}>
                        {highlightSearchText(ticket.trackingId, searchQuery)}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2" sx={fontStyles}>
                            {highlightSearchText(ticket.category.replace(/_/g, ' '), searchQuery)}
                          </Typography>
                          {/* Display appropriate subcategory based on ticket type */}
                          {ticket.category === 'ACCOUNT_MANAGEMENT' && ticket.details?.accountType && (
                            <Typography variant="caption" color="textSecondary" sx={fontStyles}>
                              {ticket.details.accountType}
                              {ticket.details?.actionType && ` (${ticket.details.actionType})`}
                            </Typography>
                          )}
                          {ticket.category === 'DOCUMENT_UPLOAD' && ticket.details?.documentType && (
                            <Typography variant="caption" color="textSecondary" sx={fontStyles}>
                              {ticket.details.documentType}
                            </Typography>
                          )}
                          {ticket.category === 'TECHNICAL_ASSISTANCE' && ticket.details?.taType && (
                            <Typography variant="caption" color="textSecondary" sx={fontStyles}>
                              {ticket.details.taType}
                            </Typography>
                          )}
                          {ticket.category === 'TROUBLESHOOTING' && ticket.details?.typeOfEquipment && (
                            <Typography variant="caption" color="textSecondary" sx={fontStyles}>
                              {ticket.details.typeOfEquipment}
                              {ticket.details?.modelOfEquipment && ` - ${ticket.details.modelOfEquipment}`}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2" sx={fontStyles}>
                            {highlightSearchText(ticket.requester?.name || 'Unknown', searchQuery)}
                          </Typography>
                          <Typography variant="caption" color="textSecondary" sx={fontStyles}>
                            {highlightSearchText(ticket.requester?.email || 'No email provided', searchQuery)}
                          </Typography>
                          {ticket.requester?.department && (
                            <Typography variant="caption" color="textSecondary" sx={fontStyles}>
                              {highlightSearchText(ticket.requester.department, searchQuery)}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ...fontStyles }}>
                          {getPriorityIcon(ticket.priority)}
                          {highlightSearchText(ticket.priority, searchQuery)}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={highlightSearchText(ticket.status.replace('_', ' '), searchQuery)}
                          color={getStatusColor(ticket.status)}
                          size="small"
                          sx={{
                            ...fontStyles,
                            fontWeight: 500,
                            borderRadius: 1,
                            background: getStatusGradient(ticket.status),
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            position: 'relative',
                            overflow: 'hidden',
                            pl: 1.5,
                            pr: 1.5,
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: 'linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.5), rgba(255,255,255,0) 70%)',
                              transform: 'translateX(-100%)',
                              animation: ticket.status === 'IN_PROGRESS' ? 'shine 2s infinite' : 'none',
                              ...globalAnimations
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell sx={fontStyles}>
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTickets.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            ...fontStyles,
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.default'
          }}
        />

        {/* Update Snackbar styling */}
        <Snackbar
          open={notificationOpen}
          autoHideDuration={6000}
          onClose={handleNotificationClose}
          message={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ...fontStyles }}>
              <NotificationsIcon color="primary" />
              {notificationMessage}
            </Box>
          }
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{
            '& .MuiSnackbarContent-root': {
              bgcolor: 'background.paper',
              color: 'text.primary',
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              boxShadow: 2,
              ...fontStyles
            }
          }}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleNotificationClose}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          }
        />

        {/* View Ticket Details Dialog */}
        <Dialog
          open={viewDetailsOpen}
          onClose={handleCloseDetails}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { 
              ...fontStyles,
              borderRadius: 2,
              backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 252, 255, 0.95) 100%)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.05)',
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at top right, rgba(25, 118, 210, 0.08), transparent 70%)',
                zIndex: 0,
                pointerEvents: 'none',
              }
            }
          }}
        >
          {selectedTicket && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, ...fontStyles }}>
                    Ticket Details #{selectedTicket.id}
                  </Typography>
                  <Chip
                    label={selectedTicket.status.replace('_', ' ')}
                    color={getStatusColor(selectedTicket.status)}
                    size="small"
                    sx={{
                      ...fontStyles,
                      fontWeight: 500,
                      borderRadius: 1,
                      background: getStatusGradient(selectedTicket.status),
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      position: 'relative',
                      overflow: 'hidden',
                      pl: 1.5,
                      pr: 1.5,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.5), rgba(255,255,255,0) 70%)',
                        transform: 'translateX(-100%)',
                        animation: selectedTicket.status === 'IN_PROGRESS' ? 'shine 2s infinite' : 'none',
                        ...globalAnimations
                      }
                    }}
                  />
                </Box>
              </DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={3}>
                  {/* Basic Information */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, ...fontStyles }}>
                      Basic Information
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <CategoryIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Category"
                          secondary={selectedTicket.category}
                          primaryTypographyProps={{ ...fontStyles, fontWeight: 500 }}
                          secondaryTypographyProps={{ ...fontStyles }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <AssignmentIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Tracking ID"
                          secondary={selectedTicket.trackingId}
                          primaryTypographyProps={{ ...fontStyles, fontWeight: 500 }}
                          secondaryTypographyProps={{ ...fontStyles }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <EventIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Created At"
                          secondary={new Date(selectedTicket.createdAt).toLocaleString()}
                          primaryTypographyProps={{ ...fontStyles, fontWeight: 500 }}
                          secondaryTypographyProps={{ ...fontStyles }}
                        />
                      </ListItem>
                    </List>
                  </Grid>

                  {/* Requester Information */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, ...fontStyles }}>
                      Requester Information
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <PersonIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Name"
                          secondary={selectedTicket.requester?.name || 'Unknown'}
                          primaryTypographyProps={{ ...fontStyles, fontWeight: 500 }}
                          secondaryTypographyProps={{ ...fontStyles }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <EmailIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Email"
                          secondary={selectedTicket.requester?.email || 'No email provided'}
                          primaryTypographyProps={{ ...fontStyles, fontWeight: 500 }}
                          secondaryTypographyProps={{ ...fontStyles }}
                        />
                      </ListItem>
                      {selectedTicket.requester?.department && (
                        <ListItem>
                          <ListItemIcon>
                            <BusinessIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Department"
                            secondary={selectedTicket.requester.department}
                            primaryTypographyProps={{ ...fontStyles, fontWeight: 500 }}
                            secondaryTypographyProps={{ ...fontStyles }}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Grid>

                  {/* Location Information */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, ...fontStyles }}>
                      Location Information
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <LocationIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Location"
                          secondary={`${locationInfo?.name || 'Unknown'} - ${locationInfo?.type} ${locationInfo?.level ? `- ${locationInfo.level}` : ''}`}
                          primaryTypographyProps={{ ...fontStyles, fontWeight: 500 }}
                          secondaryTypographyProps={{ ...fontStyles }}
                        />
                      </ListItem>
                    </List>
                  </Grid>

                  {/* Ticket Details */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, ...fontStyles }}>
                      Ticket Details
                    </Typography>
                    <List dense>
                      {/* Common details first */}
                      {(selectedTicket.details?.subject || selectedTicket.details?.documentSubject) && (
                        <ListItem>
                          <ListItemIcon>
                            <AssignmentIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Subject"
                            secondary={selectedTicket.details?.subject || selectedTicket.details?.documentSubject}
                            primaryTypographyProps={{ ...fontStyles, fontWeight: 500 }}
                            secondaryTypographyProps={{ ...fontStyles }}
                          />
                        </ListItem>
                      )}
                      
                      {(selectedTicket.details?.message || selectedTicket.details?.documentMessage) && (
                        <ListItem>
                          <ListItemIcon>
                            <DescriptionIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Message"
                            secondary={selectedTicket.details?.message || selectedTicket.details?.documentMessage}
                            primaryTypographyProps={{ ...fontStyles, fontWeight: 500 }}
                            secondaryTypographyProps={{ ...fontStyles }}
                          />
                        </ListItem>
                      )}
                      
                      {/* Troubleshooting specific details */}
                      {selectedTicket.category === 'TROUBLESHOOTING' && (
                        <>
                          {selectedTicket.details?.typeOfEquipment && (
                            <ListItem>
                              <ListItemIcon>
                                <ComputerIcon color="primary" />
                              </ListItemIcon>
                              <ListItemText
                                primary="Equipment Type"
                                secondary={selectedTicket.details.typeOfEquipment}
                                primaryTypographyProps={{ ...fontStyles, fontWeight: 500 }}
                                secondaryTypographyProps={{ ...fontStyles }}
                              />
                            </ListItem>
                          )}
                          {selectedTicket.details?.modelOfEquipment && (
                            <ListItem>
                              <ListItemIcon>
                                <BuildIcon color="primary" />
                              </ListItemIcon>
                              <ListItemText
                                primary="Equipment Model"
                                secondary={selectedTicket.details.modelOfEquipment}
                                primaryTypographyProps={{ ...fontStyles, fontWeight: 500 }}
                                secondaryTypographyProps={{ ...fontStyles }}
                              />
                            </ListItem>
                          )}
                          {selectedTicket.details?.serialNo && (
                            <ListItem>
                              <ListItemIcon>
                                <AssignmentIcon color="primary" />
                              </ListItemIcon>
                              <ListItemText
                                primary="Serial Number"
                                secondary={selectedTicket.details.serialNo}
                                primaryTypographyProps={{ ...fontStyles, fontWeight: 500 }}
                                secondaryTypographyProps={{ ...fontStyles }}
                              />
                            </ListItem>
                          )}
                          {selectedTicket.details?.specificProblem && (
                            <ListItem>
                              <ListItemIcon>
                                <DescriptionIcon color="primary" />
                              </ListItemIcon>
                              <ListItemText
                                primary="Problem Description"
                                secondary={selectedTicket.details.specificProblem}
                                primaryTypographyProps={{ ...fontStyles, fontWeight: 500 }}
                                secondaryTypographyProps={{ ...fontStyles }}
                              />
                            </ListItem>
                          )}
                        </>
                      )}
                      
                      {/* Account Management specific details */}
                      {selectedTicket.category === 'ACCOUNT_MANAGEMENT' && (
                        <>
                          {selectedTicket.details?.accountType && (
                            <ListItem>
                              <ListItemIcon>
                                <PersonIcon color="primary" />
                              </ListItemIcon>
                              <ListItemText
                                primary="Account Type"
                                secondary={selectedTicket.details.accountType}
                                primaryTypographyProps={{ ...fontStyles, fontWeight: 500 }}
                                secondaryTypographyProps={{ ...fontStyles }}
                              />
                            </ListItem>
                          )}
                          {selectedTicket.details?.actionType && (
                            <ListItem>
                              <ListItemIcon>
                                <BuildIcon color="primary" />
                              </ListItemIcon>
                              <ListItemText
                                primary="Action Type"
                                secondary={selectedTicket.details.actionType}
                                primaryTypographyProps={{ ...fontStyles, fontWeight: 500 }}
                                secondaryTypographyProps={{ ...fontStyles }}
                              />
                            </ListItem>
                          )}
                        </>
                      )}
                      
                      {/* Technical Assistance specific details */}
                      {selectedTicket.category === 'TECHNICAL_ASSISTANCE' && selectedTicket.details?.taType && (
                        <ListItem>
                          <ListItemIcon>
                            <BuildIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Assistance Type"
                            secondary={selectedTicket.details.taType}
                            primaryTypographyProps={{ ...fontStyles, fontWeight: 500 }}
                            secondaryTypographyProps={{ ...fontStyles }}
                          />
                        </ListItem>
                      )}
                      
                      {/* Document Upload specific details */}
                      {selectedTicket.category === 'DOCUMENT_UPLOAD' && selectedTicket.details?.documentType && (
                        <ListItem>
                          <ListItemIcon>
                            <AssignmentIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Document Type"
                            secondary={selectedTicket.details.documentType}
                            primaryTypographyProps={{ ...fontStyles, fontWeight: 500 }}
                            secondaryTypographyProps={{ ...fontStyles }}
                          />
                        </ListItem>
                      )}
                      
                      {/* File attachment if available */}
                      {selectedTicket.details?.fileUrl && (
                        <ListItem>
                          <ListItemIcon>
                            <AssignmentIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Attachment"
                            secondary={
                              <Link 
                                href={selectedTicket.details.fileUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                sx={{ ...fontStyles }}
                              >
                                {selectedTicket.details.fileName || 'View attached file'}
                              </Link>
                            }
                            primaryTypographyProps={{ ...fontStyles, fontWeight: 500 }}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDetails} sx={fontStyles}>
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Paper>

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

export default ViewTickets; 