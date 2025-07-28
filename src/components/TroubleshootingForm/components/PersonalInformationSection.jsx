import React from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { commonStyles } from '../styles';

const PersonalInformationSection = ({ 
  formData, 
  handleChange, 
  emailError, 
  isSubmitting 
}) => {
  return (
    <>
      {/* Personal Information Section */}
      <Box sx={{ gridColumn: '1 / -1' }}>
        <Typography variant="h6" sx={commonStyles.sectionTitle}>
          Personal Information
        </Typography>
      </Box>

      <TextField
        required
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        variant="outlined"
        disabled={isSubmitting}
      />

      <TextField
        required
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        variant="outlined"
        disabled={isSubmitting}
        error={!!emailError}
        helperText={emailError}
      />
    </>
  );
};

export default PersonalInformationSection; 