import React from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import { ticketStyles } from '../styles';
import { formatDate } from '../utils';

// Import sub-components
import TicketHeader from './TicketHeader';
import TicketStatusChips from './TicketStatusChips';
import BasicInformationSection from './BasicInformationSection';
import CategorySpecificSection from './CategorySpecificSection';
import ICTSupportSection from './ICTSupportSection';
import StatusMessageSection from './StatusMessageSection';

const TicketDetails = ({ 
  ticket, 
  loading, 
  handleDownload 
}) => {
  if (loading) {
    return (
      <Box sx={{ mt: 4 }}>
        <Paper elevation={2} sx={{ p: 5, borderRadius: 2, textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ color: 'primary.main', mb: 3 }} />
          <Typography variant="h6" color="primary" gutterBottom>
            Tracking Your Ticket
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please wait while we fetch your ticket details...
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (!ticket) return null;

  return (
    <Box sx={{ 
      mt: 4,
      opacity: ticket ? 1 : 0,
      transform: ticket ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.5s ease',
    }}>
      <Paper elevation={0} sx={ticketStyles.paper}>
        {/* Header with Tracking ID */}
        <TicketHeader ticket={ticket} />

        {/* Status and Priority Chips */}
        <TicketStatusChips ticket={ticket} />

        {/* Basic Information Section */}
        {ticket.status !== 'RESOLVED' && (
          <BasicInformationSection ticket={ticket} />
        )}

        {/* Category Specific Details */}
        {ticket.categorySpecificDetails && ticket.status !== 'RESOLVED' && (
          <CategorySpecificSection 
            ticket={ticket} 
            loading={loading}
            handleDownload={handleDownload}
          />
        )}

        {/* ICT Support Information */}
        {(ticket.status === 'IN_PROGRESS' || (ticket.status === 'RESOLVED' && ticket.category !== 'ACCOUNT_MANAGEMENT')) && (
          <ICTSupportSection ticket={ticket} />
        )}

        {/* Status-specific messages */}
        <StatusMessageSection ticket={ticket} />
      </Paper>
    </Box>
  );
};

export default TicketDetails; 