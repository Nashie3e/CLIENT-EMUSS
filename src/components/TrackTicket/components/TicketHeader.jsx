import React from 'react';
import { Box, Typography } from '@mui/material';
import { ticketStyles } from '../styles';

const TicketHeader = ({ ticket }) => {
  return (
    <Box sx={ticketStyles.header}>
      <Typography variant="h4" gutterBottom sx={ticketStyles.title}>
        📋 Ticket Details
      </Typography>
      <Box sx={ticketStyles.trackingIdBox}>
        <Typography variant="body2" sx={ticketStyles.trackingIdLabel}>
          Tracking ID
        </Typography>
        <Typography variant="h5" sx={ticketStyles.trackingIdValue}>
          {ticket.trackingId}
        </Typography>
      </Box>
    </Box>
  );
};

export default TicketHeader; 