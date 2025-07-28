import React from 'react';
import { Grid, Typography, TextField } from '@mui/material';
import { commonStyles } from '../styles';

const MessageDetailsSection = ({ 
  formData, 
  loading, 
  handleChange 
}) => {
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{
          ...commonStyles.sectionTitle,
          mt: 2
        }}>
          Message Details
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          disabled={loading}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Message"
          name="message"
          multiline
          rows={4}
          value={formData.message}
          onChange={handleChange}
          disabled={loading}
        />
      </Grid>
    </>
  );
};

export default MessageDetailsSection; 