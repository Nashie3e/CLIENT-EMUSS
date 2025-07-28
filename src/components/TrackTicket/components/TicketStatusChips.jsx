import React from 'react';
import { Box, Chip } from '@mui/material';
import {
  Info as InfoIcon,
  PriorityHigh as PriorityIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { chipStyles } from '../styles';
import { getStatusColor, getPriorityColor } from '../utils';

const TicketStatusChips = ({ ticket }) => {
  return (
    <Box sx={chipStyles.container}>
      <Chip
        icon={<InfoIcon />}
        label={`Status: ${ticket.status}`}
        sx={{
          ...chipStyles.base,
          bgcolor: `${getStatusColor(ticket.status)}08`,
          color: getStatusColor(ticket.status),
          border: `2px solid ${getStatusColor(ticket.status)}30`,
          boxShadow: `0 4px 12px ${getStatusColor(ticket.status)}20`,
          '& .MuiChip-icon': {
            color: getStatusColor(ticket.status),
          }
        }}
      />
      <Chip
        icon={<PriorityIcon />}
        label={`Priority: ${ticket.priority}`}
        sx={{
          ...chipStyles.base,
          bgcolor: `${getPriorityColor(ticket.priority)}08`,
          color: getPriorityColor(ticket.priority),
          border: `2px solid ${getPriorityColor(ticket.priority)}30`,
          boxShadow: `0 4px 12px ${getPriorityColor(ticket.priority)}20`,
          '& .MuiChip-icon': {
            color: getPriorityColor(ticket.priority),
          }
        }}
      />
      <Chip
        icon={<CategoryIcon />}
        label={`Category: ${ticket.category.replace(/_/g, ' ')}`}
        sx={{
          ...chipStyles.base,
          bgcolor: 'rgba(37, 99, 235, 0.08)',
          color: '#2563eb',
          border: '2px solid rgba(37, 99, 235, 0.3)',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
          '& .MuiChip-icon': {
            color: '#2563eb',
          }
        }}
      />
    </Box>
  );
};

export default TicketStatusChips; 