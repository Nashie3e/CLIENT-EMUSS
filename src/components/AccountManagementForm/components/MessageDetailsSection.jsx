import React from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { commonStyles } from '../styles';

const MessageDetailsSection = ({ 
  formData, 
  isSubmitting, 
  handleChange 
}) => {
  return (
    <>
      <Box sx={{ gridColumn: '1 / -1', mt: 2 }}>
        <Typography variant="h6" sx={commonStyles.sectionTitle}>
          Message Details
        </Typography>
      </Box>

      <TextField
        required
        label="Subject"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        variant="outlined"
        disabled={isSubmitting}
        className="full-width"
        sx={{ '& .MuiInputBase-input': { fontSize: '0.9rem' } }}
      />

      <TextField
        required
        multiline
        rows={4}
        label="Message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        disabled={isSubmitting}
        className="full-width"
        sx={{ 
          '& .MuiInputBase-input': { 
            fontSize: '0.9rem',
            lineHeight: '1.5'
          } 
        }}
      />
    </>
  );
};

export default MessageDetailsSection; 