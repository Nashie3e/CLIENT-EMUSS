import React from 'react';
import { 
  Box, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';
import { commonStyles } from '../styles';
import { LOCATION_TYPES } from '../constants';

const LocationSection = ({ 
  formData, 
  handleChange, 
  locations, 
  locationsLoading, 
  locationsError, 
  isSubmitting 
}) => {
  return (
    <>
      {/* Request Details Section */}
      <Box sx={{ gridColumn: '1 / -1', mt: 2 }}>
        <Typography variant="h6" sx={commonStyles.sectionTitle}>
          Request Details
        </Typography>
      </Box>

      {/* Location Selection */}
      <FormControl required className="full-width" disabled={isSubmitting}>
        <InputLabel>Location</InputLabel>
        <Select
          name="locationType"
          value={formData.locationType}
          onChange={handleChange}
          label="Location"
        >
          <MenuItem value={LOCATION_TYPES.SDO}>SDO - Imus City</MenuItem>
          <MenuItem value={LOCATION_TYPES.SCHOOL}>School - Imus City</MenuItem>
        </Select>
      </FormControl>

      {/* Department Selection */}
      {formData.locationType === LOCATION_TYPES.SDO && (
        <FormControl required className="full-width" disabled={isSubmitting || locationsLoading}>
          <InputLabel>Department</InputLabel>
          <Select
            name="department"
            value={formData.department}
            onChange={handleChange}
            label="Department"
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                  width: '30%'
                },
              },
            }}
          >
            {locationsLoading ? (
              <MenuItem disabled>Loading departments...</MenuItem>
            ) : locationsError ? (
              <MenuItem disabled>Error loading departments</MenuItem>
            ) : locations.SDO?.length === 0 ? (
              <MenuItem disabled>No departments available</MenuItem>
            ) : (
              locations.SDO?.map((department) => (
                <MenuItem key={department} value={department}>
                  {department}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      )}

      {/* School Level Selection */}
      {formData.locationType === LOCATION_TYPES.SCHOOL && (
        <FormControl required className="full-width" disabled={isSubmitting || locationsLoading}>
          <InputLabel>School Level</InputLabel>
          <Select
            name="schoolLevel"
            value={formData.schoolLevel}
            onChange={handleChange}
            label="School Level"
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                  width: '30%'
                },
              },
            }}
          >
            {locationsLoading ? (
              <MenuItem disabled>Loading school levels...</MenuItem>
            ) : locationsError ? (
              <MenuItem disabled>Error loading school levels</MenuItem>
            ) : (
              Object.keys(locations.SCHOOL).map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      )}

      {/* School Name Selection */}
      {formData.locationType === LOCATION_TYPES.SCHOOL && formData.schoolLevel && (
        <FormControl required className="full-width" disabled={isSubmitting || locationsLoading}>
          <InputLabel>School Name</InputLabel>
          <Select
            name="schoolName"
            value={formData.schoolName}
            onChange={handleChange}
            label="School Name"
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                  width: '20%'
                },
              },
            }}
          >
            {locationsLoading ? (
              <MenuItem disabled>Loading schools...</MenuItem>
            ) : locationsError ? (
              <MenuItem disabled>Error loading schools</MenuItem>
            ) : locations.SCHOOL[formData.schoolLevel]?.length === 0 ? (
              <MenuItem disabled>No schools available for this level</MenuItem>
            ) : (
              locations.SCHOOL[formData.schoolLevel]?.map((school) => (
                <MenuItem key={school} value={school}>
                  {school}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      )}
    </>
  );
};

export default LocationSection; 