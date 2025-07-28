import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Flag as PriorityIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import axios from 'axios';
import TroubleshootingDetails from '../../components/tickets/TroubleshootingDetails';
import AccountManagementDetails from '../../components/tickets/AccountManagementDetails';
import DocumentUploadDetails from '../../components/tickets/DocumentUploadDetails';
import TechnicalAssistanceDetails from '../../components/tickets/TechnicalAssistanceDetails';


const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [comment, setComment] = useState('');
  const [ictDetailsDialogOpen, setIctDetailsDialogOpen] = useState(false);
  const [ictDetails, setIctDetails] = useState({
    assignedTo: '',
    diagnosisDetails: '',
    fixDetails: '',
    dateFixed: '',
    recommendations: ''
  });
  const pageSize = 10;

  // Add notification state
  const [showNotification, setShowNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

  // Memoized helper functions defined first to avoid use-before-define issues
  const getStatusColor = useCallback((status) => {
    const colors = {
      PENDING: 'warning',
      IN_PROGRESS: 'info',
      RESOLVED: 'success',
      CLOSED: 'default',
    };
    return colors[status] || 'default';
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }, []);

  const formatDateForInput = useCallback((dateString) => {
    if (!dateString) {
      // For new dateFixed fields, automatically set to current date and time
      const now = new Date();
      // Format: YYYY-MM-DDThh:mm
      return now.toISOString().slice(0, 16);
    }
    
    // Handle existing dates with timezone adjustments
    const date = new Date(dateString);
    
    // Format to YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Format to hh:mm with local timezone
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    // Combine as YYYY-MM-DDThh:mm
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }, []);

  // Add notification handling functions
  const addNotification = useCallback((message, type = 'info', duration = 6000) => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      duration,
    };
    setCurrentNotification(newNotification);
    setShowNotification(true);
  }, []);

  const handleNotificationClose = useCallback((event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowNotification(false);
  }, []);

  // Add this useEffect to reset state when ticket status changes
  useEffect(() => {
    if (ticket) {
      setNewStatus(ticket.status);
      
      // Reset ICT details when ticket status changes
      setIctDetails({
        assignedTo: ticket.ictAssignedTo || '',
        diagnosisDetails: ticket.ictDiagnosisDetails || '',
        fixDetails: ticket.ictFixDetails || '',
        dateFixed: ticket.ictDateFixed ? formatDateForInput(ticket.ictDateFixed) : '',
        recommendations: ticket.ictRecommendations || ''
      });
      
      // Reset comment for status updates
      setComment('');
    }
  }, [ticket, formatDateForInput]);

  // Fetch ticket details
  const fetchTicketDetails = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(
        `${API_BASE_URL}/tickets/${id}?pageSize=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        const ticketData = response.data.data;
        
        // Format dates for display
        const formattedTicket = {
          ...ticketData,
          createdAt: ticketData.createdAt ? new Date(ticketData.createdAt) : null,
          updatedAt: ticketData.updatedAt ? new Date(ticketData.updatedAt) : null,
          dateOfRequest: ticketData.dateOfRequest ? new Date(ticketData.dateOfRequest) : null,
          ictDateFixed: ticketData.ictDateFixed ? new Date(ticketData.ictDateFixed) : null,
          // Ensure category specific details are properly formatted
          categorySpecificDetails: ticketData.categorySpecificDetails || {
            type: ticketData.category,
            details: {}
          }
        };

        setTicket(formattedTicket);
        setNewStatus(formattedTicket.status);
        
        // If ticket has ICT details, update the ICT details state
        if (formattedTicket.ictAssignedTo) {
          setIctDetails({
            assignedTo: formattedTicket.ictAssignedTo,
            diagnosisDetails: formattedTicket.ictDiagnosisDetails || '',
            fixDetails: formattedTicket.ictFixDetails || '',
            dateFixed: formattedTicket.ictDateFixed ? formatDateForInput(formattedTicket.ictDateFixed) : '',
            recommendations: formattedTicket.ictRecommendations || ''
          });
        }
      } else {
        throw new Error(response.data.message || 'Failed to load ticket details');
      }
    } catch (err) {
      console.error('Error fetching ticket details:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load ticket details';
      addNotification(errorMessage, 'error');
      
      // If the error is due to authentication, redirect to login
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate, pageSize, formatDateForInput, addNotification]);

  useEffect(() => {
    fetchTicketDetails();
  }, [fetchTicketDetails]);

  // Handle status update
  const handleStatusUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE_URL}/admin/tickets/${id}/status`,
        { 
          status: newStatus,
          comment: comment 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setStatusDialogOpen(false);
        fetchTicketDetails();
        addNotification(`Ticket status updated to ${newStatus.replace(/_/g, ' ')}`, 'success');

        // Send email notification when moving from RESOLVED to IN_PROGRESS
        if (ticket.status === 'RESOLVED' && newStatus === 'IN_PROGRESS') {
          try {
            await axios.post(
              `${API_BASE_URL}/admin/tickets/${id}/send-edit-notification`,
              {
                email: ticket.email,
                name: ticket.name,
                trackingId: ticket.trackingId,
                category: ticket.category,
                subject: ticket.subject || ticket.documentSubject
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            addNotification('Edit notification email sent successfully', 'success');
          } catch (emailError) {
            console.error('Error sending edit notification email:', emailError);
            addNotification('Failed to send edit notification email', 'warning');
          }
        }
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update ticket status';
      addNotification(errorMessage, 'error');
    }
  };

  // Handle document download
  const handleDownload = async (fileUrl) => {
    try {
      if (!fileUrl) {
        addNotification('No file available for download', 'error');
        return;
      }

      // If it's a Google Drive URL, open it in a new tab
      if (fileUrl.includes('drive.google.com')) {
        window.open(fileUrl, '_blank');
        return;
      }

      // For local files
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/documents/${fileUrl}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      // Create a blob URL and trigger download
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', fileUrl.split('/').pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      addNotification('File downloaded successfully', 'success');
    } catch (error) {
      console.error('Download error:', error);
      addNotification('Failed to download file', 'error');
    }
  };

  // Update the onClick handler for the Take Action button
  const handleTakeActionClick = () => {
    setIctDetails({
      assignedTo: ticket.ictAssignedTo || '',
      diagnosisDetails: ticket.ictDiagnosisDetails || '',
      fixDetails: ticket.ictFixDetails || '',
      dateFixed: ticket.ictDateFixed ? formatDateForInput(ticket.ictDateFixed) : '',
      recommendations: ticket.ictRecommendations || ''
    });
    setNewStatus('IN_PROGRESS');
    setIctDetailsDialogOpen(true);
  };

  // Update the onClick handler for the Resolve Ticket button
  const handleResolveClick = () => {
    // Auto-fill diagnosis, fix details, and recommendations based on category
    let diagnosisDetails = '';
    let fixDetails = '';
    let recommendations = '';

    // Get current date and time for the date fixed field
    const now = new Date();
    const formattedDateTime = formatDateForInput(now);

    switch (ticket.category) {
      case 'TROUBLESHOOTING':
        diagnosisDetails = `Issue: ${ticket.categorySpecificDetails?.details?.issue || 'Not specified'}\n` +
                         `Description: ${ticket.categorySpecificDetails?.details?.description || 'Not specified'}\n` +
                         `Location: ${ticket.location?.type === 'SCHOOL' ? 'School' : 'SDO'} - ${ticket.location?.type === 'SCHOOL' ? ticket.location.name : 'Imus City'}` +
                         `${ticket.location?.type === 'SCHOOL' ? '\nSchool Level: ' + (ticket.location.level || 'Not specified') : '\nDepartment: Information and Communications Technology Unit'}`;
        fixDetails = 'Issue has been resolved through troubleshooting and necessary repairs.';
        recommendations = '1. Regular maintenance is recommended to prevent similar issues.\n' +
                         '2. Keep the system updated with the latest software patches.\n' +
                         '3. Report any recurring issues immediately for further investigation.';
        break;

      case 'ACCOUNT_MANAGEMENT':
        diagnosisDetails = `Account Type: ${ticket.accountType || 'Not specified'}\n` +
                         `Action Type: ${ticket.actionType || 'Not specified'}\n` +
                         `Requested by: ${ticket.name || 'Not specified'}\n` +
                         `Email: ${ticket.email || 'Not specified'}`;
        fixDetails = ticket.actionType === 'CREATE' 
          ? 'New account has been created and credentials have been provided.'
          : 'Account password has been successfully reset and new credentials have been provided.';
        recommendations = '1. Keep your credentials secure and do not share them with others.\n' +
                         '2. Enable two-factor authentication for added security.\n' +
                         '3. Change your password regularly and use a strong password combination.';
        break;

      case 'DOCUMENT_UPLOAD':
        diagnosisDetails = `Document Type: ${ticket.categorySpecificDetails?.details?.documentType || 'Not specified'}\n` +
                         `Subject: ${ticket.documentSubject || 'Not specified'}\n` +
                         `Requested by: ${ticket.name || 'Not specified'}\n` +
                         `Department/School: ${ticket.department || ticket.schoolName || 'Not specified'}`;
        fixDetails = 'Document has been processed and uploaded to the system.';
        recommendations = '1. Keep a backup copy of all important documents.\n' +
                         '2. Ensure documents are properly labeled and organized.\n' +
                         '3. Verify document integrity after upload.';
        break;

      case 'TECHNICAL_ASSISTANCE':
        diagnosisDetails = `Assistance Type: ${ticket.categorySpecificDetails?.details?.assistanceType || 'Not specified'}\n` +
                         `Description: ${ticket.categorySpecificDetails?.details?.description || 'Not specified'}\n` +
                         `Location: ${ticket.location?.type === 'SCHOOL' ? 'School' : 'SDO'} - ${ticket.location?.type === 'SCHOOL' ? ticket.location.name : 'Imus City'}` +
                         `${ticket.location?.type === 'SCHOOL' ? '\nSchool Level: ' + (ticket.location.level || 'Not specified') : '\nDepartment: Information and Communications Technology Unit'}`;
        fixDetails = 'Technical assistance has been provided and the issue has been resolved.';
        recommendations = '1. Follow the provided instructions carefully.\n' +
                         '2. Contact ICT support if you encounter any difficulties.\n' +
                         '3. Keep your system updated and maintain regular backups.';
        break;

      default:
        diagnosisDetails = 'Ticket resolved';
        fixDetails = 'Issue has been resolved.';
        recommendations = '1. Please contact ICT support if you need further assistance.\n' +
                         '2. Keep your system updated and maintain regular backups.\n' +
                         '3. Report any issues promptly for timely resolution.';
    }

    setIctDetails({
      assignedTo: ticket.ictAssignedTo || '',
      diagnosisDetails: diagnosisDetails,
      fixDetails: fixDetails,
      dateFixed: formattedDateTime,
      recommendations: recommendations
    });
    setNewStatus('RESOLVED');
    setIctDetailsDialogOpen(true);
  };

  const handleIctActionClick = async () => {
    try {
      // Input validation
      if (newStatus === 'RESOLVED') {
        if (!ictDetails.dateFixed) {
          addNotification('Please provide the date fixed', 'error');
          return;
        }
        if (!ictDetails.fixDetails) {
          addNotification('Please provide fix details', 'error');
          return;
        }
      } else if (!ictDetails.assignedTo) {
        addNotification('Please provide the name of the ICT staff assigned', 'error');
        return;
      }

      // Set loading or disable buttons during API calls
      setLoading(true);
      
      try {
        // Prepare ICT details - ensure dateFixed is properly formatted for backend
        const formattedDetails = {
          ...ictDetails,
          // Make sure dateFixed is properly formatted if it exists
          dateFixed: ictDetails.dateFixed ? new Date(ictDetails.dateFixed).toISOString() : null
        };
        
        // 1. First update ICT details
        const token = localStorage.getItem('token');
        await axios.put(
          `${API_BASE_URL}/admin/tickets/${id}/ict-details`,
          formattedDetails,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        // 2. Then update the status with skipEmail flag
        const statusResponse = await axios.put(
          `${API_BASE_URL}/admin/tickets/${id}/status`,
          { 
            status: newStatus,
            comment: comment,
            skipEmail: true // Skip automatic email in the backend
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // 3. Send appropriate email based on status change
        if (statusResponse.data.success) {
          try {
        if (newStatus === 'IN_PROGRESS') {
          await axios.post(
            `${API_BASE_URL}/admin/tickets/${id}/send-in-progress`,
            {
              email: ticket.email,
              name: ticket.name,
              trackingId: ticket.trackingId,
              category: ticket.category,
              subject: ticket.subject || ticket.documentSubject,
              ictAssignedTo: ictDetails.assignedTo,
              accountType: ticket.accountType,
              actionType: ticket.actionType
            },
                { headers: { Authorization: `Bearer ${token}` } }
          );
          addNotification('In-progress notification email sent successfully', 'success');
        } else if (newStatus === 'RESOLVED') {
          await axios.post(
            `${API_BASE_URL}/admin/tickets/${id}/send-resolution`,
            {
              email: ticket.email,
              name: ticket.name,
              trackingId: ticket.trackingId,
              category: ticket.category,
              subject: ticket.subject || ticket.documentSubject,
              ictFixDetails: ictDetails.fixDetails || 'No fix details provided',
              ictRecommendations: ictDetails.recommendations,
              accountType: ticket.accountType,
              actionType: ticket.actionType
            },
                { headers: { Authorization: `Bearer ${token}` } }
          );
          addNotification('Resolution email sent successfully', 'success');
        }
        } catch (emailError) {
        console.error('Error sending status email:', emailError);
        addNotification(`Ticket updated but failed to send ${newStatus.toLowerCase()} email`, 'warning');
      }
      
          // Show success message and update UI
          addNotification(`Ticket status updated to ${newStatus.replace(/_/g, ' ')}`, 'success');
        }
        
        // Close dialog and refresh data
      setIctDetailsDialogOpen(false);
        fetchTicketDetails(); // This will trigger useEffect to reset the button states
      } catch (apiError) {
        console.error('API error:', apiError);
        const errorMessage = apiError.response?.data?.message || apiError.message || 'Failed to update ticket';
      addNotification(errorMessage, 'error');
      }
    } catch (err) {
      console.error('General error:', err);
      addNotification('An error occurred while processing your request', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
        sx={{
          p: { xs: 2, sm: 4 }
        }}
      >
        <CircularProgress size={isMobile ? 40 : 50} />
        <Typography
          variant="body1"
          sx={{
            fontFamily: 'Poppins',
            mt: 2,
            color: 'text.secondary',
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}
        >
          Loading ticket details...
        </Typography>
      </Box>
    );
  }

  if (!ticket) {
    return <Alert severity="error">Ticket not found</Alert>;
  }

  return (
    <Box 
      sx={{ 
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: '#f8fafc',
        minHeight: '100vh'
      }}
    >
      <Paper 
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: { xs: '12px', sm: '16px' },
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Header */}
        <Box 
          sx={{ 
            mb: { xs: 2, sm: 4 }, 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: { xs: 2, sm: 0 }
          }}
        >
          <Typography 
            variant="h4" 
            sx={{
              fontWeight: 700,
              fontFamily: '"Lisu Bosa", serif',
              background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
            }}
          >
            Tracking ID: {ticket.trackingId}
          </Typography>
          <Box sx={{ 
            display: 'flex',
            width: { xs: '100%', sm: 'auto' } 
          }}>
            <Button
              variant="outlined"
              sx={{ 
                mr: 2,
                borderColor: '#1976d2',
                color: '#1976d2',
                flex: { xs: 1, sm: 'initial' },
                '&:hover': {
                  borderColor: '#1565c0',
                  backgroundColor: 'rgba(25, 118, 210, 0.04)'
                }
              }}
              onClick={() => navigate('/admin/tickets')}
            >
              Back to List
            </Button>
            {ticket.status === 'RESOLVED' && (
            <Button
              variant="contained"
              sx={{
                flex: { xs: 1, sm: 'initial' },
                background: 'linear-gradient(135deg, #d32f2f, #f44336)',
                boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #c62828, #d32f2f)',
                }
              }}
                onClick={() => {
                  setNewStatus('IN_PROGRESS');
                  setComment('Ticket requires additional attention or changes.');
                  setStatusDialogOpen(true);
                }}
            >
                Edit Status
            </Button>
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: { xs: 2, sm: 4 } }} />

        {/* Ticket Information */}
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: { xs: 2, sm: 3 },
                height: '100%',
                borderRadius: { xs: '8px', sm: '12px' },
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                backgroundColor: 'white'
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: '#1976d2',
                  mb: 2,
                  fontFamily: '"Lisu Bosa", serif',
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
              >
                Basic Information
              </Typography>
              <List sx={{ 
                '& .MuiListItem-root': {
                  py: { xs: 1, sm: 1.5 }
                }
              }}>
                <ListItem>  
                  <ListItemText
                    primary={
                      <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500 }}>
                        Tracking ID
                      </Box>
                    }
                    secondary={
                      <Box component="span" sx={{ color: '#333', mt: 0.5 }}>
                        {ticket.trackingId}
                      </Box>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500 }}>
                        Status
                      </Box>
                    }
                    secondary={
                      <Box component="span" sx={{ mt: 0.5, display: 'inline-block' }}>
                        <Chip
                          label={ticket.status.replace(/_/g, ' ')}
                          color={getStatusColor(ticket.status)}
                          size="small"
                          sx={{ fontWeight: 500, fontSize: '0.85rem' }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500 }}>
                        Category
                      </Box>
                    }
                    secondary={
                      <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <CategoryIcon sx={{ color: '#1976d2', fontSize: '1.2rem' }} />
                        <Box component="span" sx={{ color: '#333', fontSize: '0.95rem' }}>
                          {ticket.category.replace(/_/g, ' ')}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500 }}>
                        Priority
                      </Box>
                    }
                    secondary={
                      <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <PriorityIcon sx={{ color: ticket.priority === 'HIGH' ? '#d32f2f' : '#1976d2', fontSize: '1.2rem' }} />
                        <Box component="span" sx={{ 
                          color: ticket.priority === 'HIGH' ? '#d32f2f' : '#333',
                          fontWeight: ticket.priority === 'HIGH' ? 600 : 400,
                          fontSize: '0.95rem'
                        }}>
                          {ticket.priority}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500 }}>
                        Location & Department
                      </Box>
                    }
                    secondary={
                      <Box component="span" sx={{ mt: 0.5 }}>
                        {ticket.location ? (
                          <>
                            <Box component="span" sx={{ fontSize: '0.875rem', display: 'block' }}>
                              Location: {ticket.location.type === 'SCHOOL' ? 'School' : 'SDO'} - {ticket.location.type === 'SDO' ? 'Imus City' : ticket.location.name}
                            </Box>
                            {ticket.location.type === 'SCHOOL' && (
                              <Box component="span" sx={{ fontSize: '0.875rem', display: 'block' }}>
                                School Level: {ticket.location.level || 'Not specified'}
                              </Box>
                            )}
                            {ticket.location.type === 'SDO' && (
                            <Box component="span" sx={{ fontSize: '0.875rem', display: 'block' }}>
                                Department: Information and Communications Technology Unit
                            </Box>
                            )}
                          </>
                        ) : (
                          <Box component="span" sx={{ fontSize: '0.875rem' }}>
                            Location not specified
                          </Box>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500 }}>
                        Created At
                        </Box>
                      }
                      secondary={
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <ScheduleIcon sx={{ color: '#1976d2', fontSize: '1.2rem' }} />
                          <Box component="span" sx={{ color: '#333', fontSize: '0.95rem' }}>
                          {formatDate(ticket.createdAt)}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* ICT Support Information */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: { xs: 2, sm: 3 },
                height: '100%',
                borderRadius: { xs: '8px', sm: '12px' },
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                backgroundColor: 'white'
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: { xs: 1.5, sm: 0 },
                mb: 2 
              }}>
                <Typography 
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#1976d2',
                    fontFamily: '"Lisu Bosa", serif',
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    mb: { xs: 1, sm: 0 }
                  }}
                >
                  ICT Support Information
                </Typography>
                <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
                  {!ticket.ictAssignedTo && ticket.status !== 'RESOLVED' && (
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth={isMobile}
                      disabled={loading}
                      sx={{
                        background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                        boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1565c0, #1976d2)',
                        }
                      }}
                      onClick={handleTakeActionClick}
                    >
                      Take Action
                    </Button>
                  )}
                  {ticket.ictAssignedTo && ticket.status === 'IN_PROGRESS' && (
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth={isMobile}
                      disabled={loading}
                      sx={{
                        background: 'linear-gradient(135deg, #2e7d32, #4caf50)',
                        boxShadow: '0 2px 8px rgba(46, 125, 50, 0.2)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1b5e20, #2e7d32)',
                        }
                      }}
                      onClick={handleResolveClick}
                    >
                      Resolve Ticket
                    </Button>
                  )}
                  {ticket.status === 'RESOLVED' && (
                    <Chip
                      label="Resolved"
                      color="success"
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  )}
                </Box>
              </Box>
              <List sx={{ 
                '& .MuiListItem-root': {
                  py: { xs: 1, sm: 1.5 }
                }
              }}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500 }}>
                        Assigned To
                      </Box>
                    }
                    secondary={
                      <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <PersonIcon sx={{ color: '#1976d2', fontSize: '1.2rem' }} />
                        <Box component="span" sx={{ 
                          color: ticket.ictAssignedTo ? '#333' : '#666',
                          fontStyle: ticket.ictAssignedTo ? 'normal' : 'italic',
                          fontSize: '0.95rem',
                          display: 'block'
                        }}>
                          {ticket.ictAssignedTo || 'Not yet assigned'}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500 }}>
                        Diagnosis Details
                      </Box>
                    }
                    secondary={
                      <Box component="span" sx={{ 
                        color: ticket.ictDiagnosisDetails ? '#333' : '#666',
                        fontStyle: ticket.ictDiagnosisDetails ? 'normal' : 'italic',
                        fontSize: '0.95rem',
                        mt: 0.5,
                        display: 'block'
                      }}>
                        {ticket.ictDiagnosisDetails || 'No diagnosis provided'}
                      </Box>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500 }}>
                        Fix Details
                      </Box>
                    }
                    secondary={
                      <Box component="span" sx={{ 
                        color: ticket.ictFixDetails ? '#333' : '#666',
                        fontStyle: ticket.ictFixDetails ? 'normal' : 'italic',
                        fontSize: '0.95rem',
                        mt: 0.5,
                        display: 'block'
                      }}>
                        {ticket.ictFixDetails || 'No fix details provided'}
                      </Box>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500 }}>
                        Date Fixed
                      </Box>
                    }
                    secondary={
                      <Box component="span" sx={{ 
                        color: ticket.ictDateFixed ? '#333' : '#666',
                        fontStyle: ticket.ictDateFixed ? 'normal' : 'italic',
                        fontSize: '0.95rem',
                        mt: 0.5,
                        display: 'block'
                      }}>
                        {ticket.ictDateFixed ? formatDate(ticket.ictDateFixed) : 'Not yet fixed'}
                      </Box>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500 }}>
                        Recommendations
                      </Box>
                    }
                    secondary={
                      <Box component="span" sx={{ 
                        color: ticket.ictRecommendations ? '#333' : '#666',
                        fontStyle: ticket.ictRecommendations ? 'normal' : 'italic',
                        fontSize: '0.95rem',
                        mt: 0.5,
                        display: 'block'
                      }}>
                        {ticket.ictRecommendations || 'No recommendations provided'}
                      </Box>
                    }
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Ticket Details */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: { xs: '8px', sm: '12px' },
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                backgroundColor: 'white'
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: '#1976d2',
                  mb: { xs: 1.5, sm: 3 },
                  fontFamily: '"Lisu Bosa", serif',
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
              >
                Ticket Details
              </Typography>
              <Box sx={{ 
                bgcolor: 'rgba(25, 118, 210, 0.04)', 
                p: { xs: 1.5, sm: 2 }, 
                borderRadius: '8px' 
              }}>
                {ticket.category === 'TROUBLESHOOTING' && (
                  <TroubleshootingDetails 
                    ticket={ticket} 
                    formatDate={formatDate} 
                    handleDownload={handleDownload}
                  />
                )}

                {ticket.category === 'ACCOUNT_MANAGEMENT' && (
                  <AccountManagementDetails ticket={ticket} />
                )}

                {ticket.category === 'DOCUMENT_UPLOAD' && (
                  <DocumentUploadDetails ticket={ticket} handleDownload={handleDownload} />
                      )}

                {ticket.category === 'TECHNICAL_ASSISTANCE' && (
                  <TechnicalAssistanceDetails ticket={ticket} formatDate={formatDate} />
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Updates History */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: { xs: '8px', sm: '12px' },
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                backgroundColor: 'white'
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: '#1976d2',
                  mb: { xs: 1.5, sm: 3 },
                  fontFamily: '"Lisu Bosa", serif',
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
              >
                Updates History
              </Typography>
              <List sx={{ 
                '& .MuiListItem-root': {
                  mb: 2,
                  bgcolor: 'rgba(25, 118, 210, 0.04)',
                  borderRadius: '8px',
                  p: { xs: 1.5, sm: 2 }
                }
              }}>
                {ticket.updates?.data.map((update) => (
                  <ListItem 
                    key={update.id} 
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Chip
                            label={update.newStatus.replace(/_/g, ' ')}
                            color={getStatusColor(update.newStatus)}
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                          <Typography 
                            component="span" 
                            variant="caption" 
                            sx={{ 
                              color: '#666',
                              fontStyle: 'italic'
                            }}
                          >
                            {formatDate(update.createdAt)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box 
                          sx={{ 
                            color: '#333',
                            bgcolor: 'white',
                            p: 1.5,
                            borderRadius: '4px',
                            border: '1px solid rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          {update.comment}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Status Update Dialog */}
      <Dialog 
        open={statusDialogOpen} 
        onClose={() => setStatusDialogOpen(false)}
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            margin: isMobile ? 0 : undefined,
            width: isMobile ? '100%' : undefined,
            maxHeight: isMobile ? '100%' : undefined,
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            fontFamily: '"Lisu Bosa", serif',
            fontWeight: 600,
            color: '#1976d2',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            pb: 2
          }}
        >
          Update Ticket Status
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>New Status</InputLabel>
            <Select
              value={newStatus}
              label="New Status"
              onChange={(e) => setNewStatus(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="RESOLVED">Resolved</MenuItem>
              <MenuItem value="CLOSED">Closed</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment about this status update..."
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.1)'
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <Button 
            onClick={() => setStatusDialogOpen(false)}
            sx={{
              color: '#666',
              '&:hover': {
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleStatusUpdate} 
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0, #1976d2)',
              }
            }}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* ICT Details Dialog */}
      <Dialog 
        open={ictDetailsDialogOpen} 
        onClose={() => setIctDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            margin: isMobile ? 0 : undefined,
            width: isMobile ? '100%' : undefined,
            maxHeight: isMobile ? '100%' : undefined,
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            fontFamily: '"Lisu Bosa", serif',
            fontWeight: 600,
            color: '#1976d2',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            pb: 2
          }}
        >
          {newStatus === 'RESOLVED' ? 'Resolve Ticket' : 'Take Action on Ticket'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="info" sx={{ mb: 1 }}>
              {newStatus === 'RESOLVED'
                ? 'Please provide resolution details to complete this ticket'
                : 'Taking action on this ticket will automatically set its status to "In Progress"'
              }
            </Alert>
            <FormControl fullWidth required>
              <InputLabel>Assigned To</InputLabel>
              <Select
              value={ictDetails.assignedTo}
                label="Assigned To"
              onChange={(e) => setIctDetails({ ...ictDetails, assignedTo: e.target.value })}
              disabled={Boolean(ticket.ictAssignedTo)}
              >
                <MenuItem value="Shaina Montano">Shaina Montano</MenuItem>
                <MenuItem value="Mark Joseph Chaewon">Mark Joseph Chaewon</MenuItem>
                <MenuItem value="Matthew Romero">Matthew Romero</MenuItem>
              </Select>
            </FormControl>
            {newStatus === 'RESOLVED' && (
              <>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Diagnosis Details"
                  value={ictDetails.diagnosisDetails}
                  onChange={(e) => setIctDetails({ ...ictDetails, diagnosisDetails: e.target.value })}
                  placeholder="Detailed diagnosis of the issue"
                  required
                  error={!ictDetails.diagnosisDetails}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Fix Details"
                  value={ictDetails.fixDetails}
                  onChange={(e) => setIctDetails({ ...ictDetails, fixDetails: e.target.value })}
                  placeholder="Details of how the issue was fixed"
                  required
                  error={!ictDetails.fixDetails}
                />
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Date Fixed"
                  value={ictDetails.dateFixed}
                  onChange={(e) => setIctDetails({ ...ictDetails, dateFixed: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                  error={!ictDetails.dateFixed}
                  helperText={!ictDetails.dateFixed ? "Please select the date and time when the issue was fixed" : "Date and time when the issue was fixed"}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#1976d2',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1976d2',
                        borderWidth: 2
                      }
                    },
                    '& input::-webkit-calendar-picker-indicator': {
                      cursor: 'pointer',
                      filter: 'invert(0.5)'
                    }
                  }}
                />
              </>
            )}
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Status Update Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment about the actions taken..."
              required
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <Button 
            onClick={() => setIctDetailsDialogOpen(false)}
            sx={{ color: '#666' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleIctActionClick}
            variant="contained"
            disabled={loading}
            sx={{
              background: newStatus === 'RESOLVED' 
                ? 'linear-gradient(135deg, #2e7d32, #4caf50)'
                : 'linear-gradient(135deg, #1976d2, #42a5f5)',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
              '&:hover': {
                background: newStatus === 'RESOLVED'
                  ? 'linear-gradient(135deg, #1b5e20, #2e7d32)'
                  : 'linear-gradient(135deg, #1565c0, #1976d2)',
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              newStatus === 'RESOLVED' ? 'Complete Resolution' : 'Assign Ticket'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Snackbar */}
      <Snackbar
        open={showNotification}
        autoHideDuration={currentNotification?.duration || 6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ 
          vertical: isMobile ? 'bottom' : 'top', 
          horizontal: isMobile ? 'center' : 'right' 
        }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={currentNotification?.type || 'info'}
          sx={{
            width: '100%',
            alignItems: 'center',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            '& .MuiAlert-icon': {
              fontSize: '24px'
            }
          }}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleNotificationClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          {currentNotification?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TicketDetails; 