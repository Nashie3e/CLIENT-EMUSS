import React from 'react';
import { 
  Box, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  CircularProgress 
} from '@mui/material';
import { ACTION_TYPES, PRIORITIES } from '../constants';
import { commonStyles } from '../styles';

const RequestDetailsSection = ({ 
  formData, 
  accountTypes,
  isLoadingAccountTypes,
  isSubmitting, 
  handleChange 
}) => {
  return (
    <>
      <Box sx={{ gridColumn: '1 / -1', mt: 2 }}>
        <Typography variant="h6" sx={commonStyles.sectionTitle}>
          Request Details
        </Typography>
      </Box>

      <FormControl required>
        <InputLabel>Action Type</InputLabel>
        <Select
          name="actionType"
          value={formData.actionType}
          onChange={handleChange}
          label="Action Type"
          disabled={isSubmitting}
          sx={{ fontSize: '0.9rem' }}
        >
          {ACTION_TYPES.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl required>
        <InputLabel>Account Type</InputLabel>
        <Select
          name="accountType"
          value={formData.accountType}
          onChange={handleChange}
          label="Account Type"
          disabled={isSubmitting || isLoadingAccountTypes}
          sx={{ fontSize: '0.9rem' }}
        >
          {accountTypes.map((type) => (
            <MenuItem key={type.id} value={type.id}>
              {type.name}
            </MenuItem>
          ))}
        </Select>
        {isLoadingAccountTypes && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <CircularProgress size={16} sx={{ mr: 1 }} />
            <Typography variant="caption" color="text.secondary">
              Loading account types...
            </Typography>
          </Box>
        )}
      </FormControl>

      <FormControl required>
        <InputLabel>Priority</InputLabel>
        <Select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          label="Priority"
          disabled={isSubmitting}
          sx={{ fontSize: '0.9rem' }}
        >
          {PRIORITIES.map((priority) => (
            <MenuItem key={priority.value} value={priority.value}>
              {priority.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default RequestDetailsSection; 