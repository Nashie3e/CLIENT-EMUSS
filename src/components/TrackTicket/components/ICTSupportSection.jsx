import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { sectionStyles } from '../styles';
import { formatDate } from '../utils';

const ICTSupportSection = ({ ticket }) => {
  return (
    <Box sx={{ 
      ...sectionStyles.container,
      background: 'linear-gradient(135deg, #e0f2fe 0%, #e1f5fe 100%)',
      border: '1px solid rgba(0, 172, 193, 0.2)',
      boxShadow: '0 8px 20px rgba(0, 172, 193, 0.08), 0 2px 8px rgba(0, 172, 193, 0.04)',
      '&::before': {
        background: 'linear-gradient(180deg, #0891b2, #00acc1)',
      }
    }}>
      <Typography variant="h5" sx={sectionStyles.title}>
        🛠️ ICT Support Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ 
            ...sectionStyles.infoCard,
            border: '1px solid rgba(0, 172, 193, 0.15)',
            boxShadow: '0 4px 12px rgba(0, 172, 193, 0.08)',
          }}>
            <Typography variant="body2" color="#0e7490" gutterBottom sx={sectionStyles.infoLabel}>
              👨‍💻 Assigned To
            </Typography>
            <Typography variant="body1" sx={{ 
              ...sectionStyles.infoValue,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}>
              <PersonIcon fontSize="small" sx={{ color: '#0891b2' }} />
              {ticket.ictAssignedTo || 'Not yet assigned'}
            </Typography>
          </Box>
        </Grid>
        {ticket.ictDiagnosisDetails && (
          <Grid item xs={12}>
            <Box sx={{ 
              ...sectionStyles.infoCard,
              border: '1px solid rgba(0, 172, 193, 0.15)',
              boxShadow: '0 4px 12px rgba(0, 172, 193, 0.08)',
            }}>
              <Typography variant="body2" color="#0e7490" gutterBottom sx={sectionStyles.infoLabel}>
                🔍 Diagnosis
              </Typography>
              <Typography variant="body1" sx={{ 
                ...sectionStyles.infoValue,
                lineHeight: 1.6
              }}>
                {ticket.ictDiagnosisDetails}
              </Typography>
            </Box>
          </Grid>
        )}
        {ticket.ictFixDetails && (
          <Grid item xs={12}>
            <Box sx={{ 
              ...sectionStyles.infoCard,
              border: '1px solid rgba(0, 172, 193, 0.15)',
              boxShadow: '0 4px 12px rgba(0, 172, 193, 0.08)',
            }}>
              <Typography variant="body2" color="#0e7490" gutterBottom sx={sectionStyles.infoLabel}>
                🔧 Fix Details
              </Typography>
              <Typography variant="body1" sx={{ 
                ...sectionStyles.infoValue,
                lineHeight: 1.6
              }}>
                {ticket.ictFixDetails}
              </Typography>
            </Box>
          </Grid>
        )}
        {ticket.ictDateFixed && (
          <Grid item xs={12}>
            <Box sx={{ 
              ...sectionStyles.infoCard,
              border: '1px solid rgba(0, 172, 193, 0.15)',
              boxShadow: '0 4px 12px rgba(0, 172, 193, 0.08)',
            }}>
              <Typography variant="body2" color="#0e7490" gutterBottom sx={sectionStyles.infoLabel}>
                📅 Date Fixed
              </Typography>
              <Typography variant="body1" sx={sectionStyles.infoValue}>
                {formatDate(ticket.ictDateFixed)}
              </Typography>
            </Box>
          </Grid>
        )}
        {ticket.ictRecommendations && (
          <Grid item xs={12}>
            <Box sx={{ 
              ...sectionStyles.infoCard,
              border: '1px solid rgba(0, 172, 193, 0.15)',
              boxShadow: '0 4px 12px rgba(0, 172, 193, 0.08)',
            }}>
              <Typography variant="body2" color="#0e7490" gutterBottom sx={sectionStyles.infoLabel}>
                💡 Recommendations
              </Typography>
              <Typography variant="body1" sx={{ 
                ...sectionStyles.infoValue,
                lineHeight: 1.6
              }}>
                {ticket.ictRecommendations}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ICTSupportSection; 