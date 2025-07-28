import React from 'react';
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
} from '@mui/material';

const TechnicalAssistanceDetails = ({ ticket, formatDate }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography 
          variant="subtitle1" 
          sx={{
            fontWeight: 600,
            color: '#1976d2',
            mb: 2,
            fontFamily: 'Poppins'
          }}
        >
          Technical Assistance Details
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <List>
          <ListItem>
            <ListItemText
              primary={
                <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'Poppins' }}>
                  Name
                </Box>
              }
              secondary={
                <Box component="span" sx={{ color: '#333', mt: 0.5, fontFamily: 'Poppins', display: 'block' }}>
                  {ticket.name || 'N/A'}
                </Box>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={
                <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'Poppins' }}>
                  Email
                </Box>
              }
              secondary={
                <Box component="span" sx={{ color: '#333', mt: 0.5, fontFamily: 'Poppins', display: 'block' }}>
                  {ticket.email || 'N/A'}
                </Box>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={
                <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'Poppins' }}>
                  TA Type
                </Box>
              }
              secondary={
                <Box component="span" sx={{ color: '#333', mt: 0.5, fontFamily: 'Poppins' }}>
                  {ticket.taType?.name || ticket.categorySpecificDetails?.details?.taType || 'Not specified'}
                </Box>
              }
            />
          </ListItem>
        </List>
      </Grid>
      <Grid item xs={12} md={6}>
        <List>
          {Object.entries(ticket.categorySpecificDetails?.details || {}).map(([key, value]) => {
            // Skip these fields as they're already shown elsewhere
            if (!value || ['location', 'schoolLevel', 'schoolName', 'department', 'type', 'taType'].includes(key)) return null;
            return (
              <ListItem key={key}>
                <ListItemText
                  primary={
                    <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'Poppins' }}>
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </Box>
                  }
                  secondary={
                    <Box component="span" sx={{ color: '#333', mt: 0.5, fontFamily: 'Poppins' }}>
                      {key.toLowerCase().includes('date') 
                        ? formatDate(value)
                        : typeof value === 'object' 
                          ? JSON.stringify(value) 
                          : String(value)}
                    </Box>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </Grid>
      <Grid item xs={12}>
        <ListItem>
          <ListItemText
            primary={
              <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'Poppins' }}>
                Message
              </Box>
            }
            secondary={
              <Box component="span" sx={{ 
                color: '#333', 
                mt: 0.5,
                bgcolor: 'white',
                p: 2,
                borderRadius: '4px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                display: 'block',
                whiteSpace: 'pre-wrap',
                width: '100%',
                fontFamily: 'Poppins'
              }}>
                {ticket.message || 'Not provided'}
              </Box>
            }
          />
        </ListItem>
      </Grid>
    </Grid>
  );
};

export default TechnicalAssistanceDetails; 