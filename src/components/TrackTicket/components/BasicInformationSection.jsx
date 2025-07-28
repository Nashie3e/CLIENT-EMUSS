import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { sectionStyles } from '../styles';
import { formatDate } from '../utils';

const BasicInformationSection = ({ ticket }) => {
  return (
    <Box sx={{ 
      ...sectionStyles.container,
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      '&::before': {
        background: 'linear-gradient(180deg, #2563eb, #3b82f6)',
      }
    }}>
      <Typography variant="h5" gutterBottom sx={sectionStyles.title}>
        📝 Basic Information
      </Typography>
      <Grid container spacing={3}>
        {/* Only show name field if not Account Management */}
        {ticket.category !== 'ACCOUNT_MANAGEMENT' && (
          <Grid item xs={12} sm={6}>
            <Box sx={sectionStyles.infoCard}>
              <Typography variant="body2" color="#64748b" gutterBottom sx={sectionStyles.infoLabel}>
                👤 Name
              </Typography>
              <Typography variant="body1" sx={sectionStyles.infoValue}>
                {ticket.name}
              </Typography>
            </Box>
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <Box sx={sectionStyles.infoCard}>
            <Typography variant="body2" color="#64748b" gutterBottom sx={sectionStyles.infoLabel}>
              ✉️ Email
            </Typography>
            <Typography variant="body1" sx={{ 
              ...sectionStyles.infoValue,
              wordBreak: 'break-word'
            }}>
              {ticket.email}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={sectionStyles.infoCard}>
            <Typography variant="body2" color="#64748b" gutterBottom sx={sectionStyles.infoLabel}>
              📅 Created
            </Typography>
            <Typography variant="body1" sx={sectionStyles.infoValue}>
              {formatDate(ticket.createdAt)}
            </Typography>
          </Box>
        </Grid>
        {ticket.location && (
          <Grid item xs={12} sm={6}>
            <Box sx={sectionStyles.infoCard}>
              <Typography variant="body2" color="#64748b" gutterBottom sx={sectionStyles.infoLabel}>
                📍 Location
              </Typography>
              <Typography variant="body1" sx={sectionStyles.infoValue}>
                {ticket.location.type === 'SCHOOL' ? '🏫 School - ' : '🏢 SDO - '}
                {ticket.location.type === 'SCHOOL' ? ticket.location.name : 'Imus City'}
                {ticket.location.type === 'SCHOOL' && ticket.location.level && (
                  <Typography 
                    component="span" 
                    display="block" 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'Poppins', 
                      mt: 0.5,
                      color: '#64748b',
                      fontSize: '0.875rem'
                    }}
                  >
                    School Level: {ticket.location.level}
                  </Typography>
                )}
                {ticket.location.type === 'SDO' && (
                  <Typography 
                    component="span" 
                    display="block" 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'Poppins', 
                      mt: 0.5,
                      color: '#64748b',
                      fontSize: '0.875rem'
                    }}
                  >
                    Department: {ticket.department || 'Information and Communications Technology Unit'}
                  </Typography>
                )}
              </Typography>
            </Box>
          </Grid>
        )}
        {/* Category-specific type information */}
        {ticket.category === 'DOCUMENT_UPLOAD' && ticket.documentType && (
          <Grid item xs={12} sm={6}>
            <Box sx={sectionStyles.infoCard}>
              <Typography variant="body2" color="#64748b" gutterBottom sx={sectionStyles.infoLabel}>
                📄 Document Type
              </Typography>
              <Typography variant="body1" sx={sectionStyles.infoValue}>
                {ticket.documentType.name || 'Not specified'}
              </Typography>
            </Box>
          </Grid>
        )}
        {ticket.category === 'ACCOUNT_MANAGEMENT' && ticket.accountType && (
          <Grid item xs={12} sm={6}>
            <Box sx={sectionStyles.infoCard}>
              <Typography variant="body2" color="#64748b" gutterBottom sx={sectionStyles.infoLabel}>
                👥 Account Type
              </Typography>
              <Typography variant="body1" sx={sectionStyles.infoValue}>
                {ticket.accountType.name || 'Not specified'}
              </Typography>
            </Box>
          </Grid>
        )}
        {ticket.category === 'TECHNICAL_ASSISTANCE' && ticket.taType && (
          <Grid item xs={12} sm={6}>
            <Box sx={sectionStyles.infoCard}>
              <Typography variant="body2" color="#64748b" gutterBottom sx={sectionStyles.infoLabel}>
                🛠️ Technical Assistance Type
              </Typography>
              <Typography variant="body1" sx={sectionStyles.infoValue}>
                {ticket.taType.name || 'Not specified'}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default BasicInformationSection; 