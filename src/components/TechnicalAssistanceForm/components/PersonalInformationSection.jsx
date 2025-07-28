import React from 'react';
import { Grid, Typography, TextField } from '@mui/material';
import { commonStyles } from '../styles';

const PersonalInformationSection = ({ 
  formData, 
  emailError, 
  loading, 
  handleChange 
}) => {
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6" sx={commonStyles.sectionTitle}>
          Personal Information
        </Typography>
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={loading}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={!!emailError}
          helperText={emailError}
          disabled={loading}
        />
      </Grid>
    </>
  );
};

export default PersonalInformationSection; 