import React from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { sectionStyles } from '../styles';
import { formatDate } from '../utils';

const CategorySpecificSection = ({ ticket, loading, handleDownload }) => {
  return (
    <Box sx={{ 
      ...sectionStyles.container,
      background: 'linear-gradient(135deg, #fef3c7 0%, #fef7cd 100%)',
      border: '1px solid rgba(251, 191, 36, 0.2)',
      boxShadow: '0 8px 20px rgba(251, 191, 36, 0.08), 0 2px 8px rgba(251, 191, 36, 0.04)',
      '&::before': {
        background: 'linear-gradient(180deg, #f59e0b, #fbbf24)',
      }
    }}>
      <Typography variant="h5" gutterBottom sx={sectionStyles.title}>
        ⚙️ {ticket.categorySpecificDetails.type} Details
      </Typography>
      <Grid container spacing={3}>
        {Object.entries(ticket.categorySpecificDetails.details).map(([key, value]) => {
          // Skip basic fields already shown and file-related fields
          if (!value || 
              key === 'fileName' || 
              key === 'filePath' || 
              key === 'originalFileName' || 
              key === 'fileType' || 
              key === 'fileSize' ||
              key === 'name' ||
              key === 'email' ||
              key === 'location' ||
              key === 'department' ||
              key === 'documentType' ||
              key === 'accountType' ||
              key === 'taType') return null;
          
          // Skip fields that are shown in the Basic Information section
          if ((key === 'documentType' && ticket.documentType) ||
              (key === 'accountType' && ticket.accountType) || 
              (key === 'taType' && ticket.taType)) return null;
          
          // Handle object values
          let displayValue = value;
          if (typeof value === 'object' && value !== null) {
            displayValue = value.name || value.type || JSON.stringify(value);
          }
          
          return (
            <Grid item xs={12} sm={6} key={key}>
              <Box sx={{ 
                ...sectionStyles.infoCard,
                border: '1px solid rgba(251, 191, 36, 0.15)',
                boxShadow: '0 4px 12px rgba(251, 191, 36, 0.08)',
              }}>
                <Typography variant="body2" color="#b45309" gutterBottom sx={sectionStyles.infoLabel}>
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </Typography>
                <Typography variant="body1" sx={sectionStyles.infoValue}>
                  {key === 'dateOfRequest' ? formatDate(displayValue) : (Array.isArray(displayValue) ? displayValue.join(', ') : displayValue)}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
      
      {/* Document Download Button */}
      {ticket.category === 'DOCUMENT_UPLOAD' && ticket.categorySpecificDetails?.details?.fileName && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            disabled={loading}
            sx={{
              py: 2,
              px: 4,
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              fontFamily: 'Poppins',
              fontSize: '1rem',
              bgcolor: '#f59e0b',
              color: '#ffffff',
              boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)',
              '&:hover': {
                bgcolor: '#d97706',
                boxShadow: '0 10px 25px rgba(245, 158, 11, 0.4)',
                transform: 'translateY(-2px)'
              },
              '&:disabled': {
                bgcolor: '#d1d5db',
                color: '#6b7280'
              }
            }}
          >
            {loading ? '⏳ Downloading...' : `📥 Download ${ticket.categorySpecificDetails.details.originalFileName || 'Attached Document'}`}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CategorySpecificSection; 