import React from 'react';
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Email as EmailIcon,
  Tag as TagIcon
} from '@mui/icons-material';
import { formStyles } from '../styles';

const TrackingForm = ({ 
  formData, 
  loading, 
  handleChange, 
  handleSubmit 
}) => {
  return (
    <Paper elevation={0} sx={formStyles.paper}>
      <Typography variant="h4" gutterBottom align="center" sx={formStyles.title}>
        Track Your Ticket
      </Typography>

      <Typography variant="subtitle1" align="center" sx={formStyles.subtitle}>
        Enter your ticket details below to check the status
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={formStyles.container}>
        <TextField
          fullWidth
          required
          name="trackingId"
          label="Tracking ID"
          value={formData.trackingId}
          onChange={handleChange}
          placeholder="TK-XXXXXXXX"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TagIcon sx={{ color: '#000000' }} />
              </InputAdornment>
            ),
          }}
          sx={formStyles.textField}
          helperText="Enter your ticket ID in the format TK-XXXXXXXX"
        />

        <TextField
          fullWidth
          required
          name="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ color: '#000000' }} />
              </InputAdornment>
            ),
          }}
          sx={formStyles.textField}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          type="submit"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
          sx={formStyles.button}
        >
          {loading ? 'Searching...' : 'Track Ticket'}
        </Button>
      </Box>
    </Paper>
  );
};

export default TrackingForm; 