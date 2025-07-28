import React from 'react';
import { 
  Grid, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  TextField 
} from '@mui/material';
import { PRIORITIES, MENU_PROPS } from '../constants';
import { commonStyles } from '../styles';

const RequestDetailsSection = ({ 
  formData, 
  taTypes,
  isLoadingTATypes,
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
          Request Details
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth required>
          <InputLabel>Priority</InputLabel>
          <Select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            label="Priority"
            disabled={loading}
            MenuProps={MENU_PROPS}
          >
            {PRIORITIES.map((priority) => (
              <MenuItem key={priority.value} value={priority.value}>
                {priority.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth required>
          <InputLabel>TA Type</InputLabel>
          <Select
            name="taType"
            value={formData.taType}
            onChange={handleChange}
            label="TA Type"
            disabled={loading || isLoadingTATypes}
            MenuProps={MENU_PROPS}
          >
            {taTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
            <MenuItem value="others">Others</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {formData.taType === 'others' && (
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Specify TA Type"
            name="otherTaType"
            value={formData.otherTaType}
            onChange={handleChange}
            disabled={loading}
            placeholder="Please specify the type of technical assistance"
          />
        </Grid>
      )}
    </>
  );
};

export default RequestDetailsSection; 