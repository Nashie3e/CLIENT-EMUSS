import React from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { commonStyles } from '../styles';

const PersonalInformationSection = ({ 
  formData, 
  emailError, 
  isSubmitting, 
  handleChange 
}) => {
  return (
    <>
      <Box sx={{ gridColumn: '1 / -1' }}>
        <Typography variant="h6" sx={commonStyles.sectionTitle}>
          Personal Information
        </Typography>
      </Box>

      <TextField
        required
        label="Personal Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        variant="outlined"
        disabled={isSubmitting}
        error={!!emailError}
        helperText={emailError}
        className="full-width"
        sx={{ '& .MuiInputBase-input': { fontSize: '0.9rem' } }}
      />
    </>
  );
};

export default PersonalInformationSection; 