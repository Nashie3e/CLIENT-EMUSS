import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Box,
  Typography,
  CircularProgress 
} from '@mui/material';

const LocationSection = ({ 
  formData, 
  locations,
  isLoadingLocations,
  isSubmitting, 
  handleChange 
}) => {
  return (
    <>
      {/* SDO Department Selection */}
      {formData.locationType === 'SDO' && (
        <FormControl required className="full-width">
          <InputLabel>Department</InputLabel>
          <Select
            name="department"
            value={formData.department}
            onChange={handleChange}
            label="Department"
            disabled={isSubmitting || isLoadingLocations}
            sx={{ fontSize: '0.9rem' }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300
                },
              },
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left'
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left'
              }
            }}
          >
            {locations.SDO.length > 0 ? (
              locations.SDO.map((department) => (
                <MenuItem key={department} value={department}>
                  {department}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled value="">
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: 'text.secondary',
                  py: 1
                }}>
                  No departments available
                </Box>
              </MenuItem>
            )}
          </Select>
          {isLoadingLocations && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              <Typography variant="caption" color="text.secondary">
                Loading departments...
              </Typography>
            </Box>
          )}
        </FormControl>
      )}

      {/* School Selection */}
      {formData.locationType === 'SCHOOL' && (
        <>
          <FormControl required>
            <InputLabel>School Level</InputLabel>
            <Select
              name="schoolLevel"
              value={formData.schoolLevel}
              onChange={handleChange}
              label="School Level"
              disabled={isSubmitting || isLoadingLocations}
              sx={{ fontSize: '0.9rem' }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300
                  },
                },
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left'
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left'
                }
              }}
            >
              {Object.keys(locations.SCHOOL).map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
            {isLoadingLocations && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                <Typography variant="caption" color="text.secondary">
                  Loading school levels...
                </Typography>
              </Box>
            )}
          </FormControl>

          {formData.schoolLevel && (
            <FormControl required>
              <InputLabel>School Name</InputLabel>
              <Select
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                label="School Name"
                disabled={isSubmitting || isLoadingLocations}
                sx={{ fontSize: '0.9rem' }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300
                    },
                  },
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left'
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left'
                  }
                }}
              >
                {locations.SCHOOL[formData.schoolLevel]?.length > 0 ? (
                  locations.SCHOOL[formData.schoolLevel].map((school) => (
                    <MenuItem key={school} value={school}>
                      {school}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled value="">
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: 'text.secondary',
                      py: 1
                    }}>
                      No schools available for this level
                    </Box>
                  </MenuItem>
                )}
              </Select>
              {isLoadingLocations && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    Loading schools...
                  </Typography>
                </Box>
              )}
            </FormControl>
          )}
        </>
      )}
    </>
  );
};

export default LocationSection; 