import React from 'react';
import { 
  Grid,
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Box,
  Typography,
  CircularProgress 
} from '@mui/material';
import { LOCATION_TYPES, MENU_PROPS } from '../constants';
import { commonStyles } from '../styles';

const LocationSection = ({ 
  formData, 
  locations,
  isLoadingLocations,
  loading, 
  handleChange 
}) => {
  return (
    <>
      <Grid item xs={12}>
        <FormControl fullWidth required>
          <InputLabel>Location</InputLabel>
          <Select
            name="location"
            value={formData.location}
            onChange={handleChange}
            label="Location"
            disabled={loading || isLoadingLocations}
            MenuProps={MENU_PROPS}
          >
            {LOCATION_TYPES.map((location) => (
              <MenuItem key={location.value} value={location.value}>
                {location.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* School Selection */}
      {formData.location === 'SCHOOL_IMUS_CITY' && (
        <>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>School Level</InputLabel>
              <Select
                name="schoolLevel"
                value={formData.schoolLevel}
                onChange={handleChange}
                label="School Level"
                disabled={loading || isLoadingLocations}
                MenuProps={MENU_PROPS}
              >
                {Object.keys(locations.SCHOOL).length > 0 ? (
                  Object.keys(locations.SCHOOL).map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled value="">
                    <Box sx={commonStyles.loadingContainer}>
                      {isLoadingLocations ? 'Loading school levels...' : 'No school levels available'}
                    </Box>
                  </MenuItem>
                )}
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
          </Grid>

          {formData.schoolLevel && (
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>School Name</InputLabel>
                <Select
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  label="School Name"
                  disabled={loading || isLoadingLocations}
                  MenuProps={MENU_PROPS}
                >
                  {locations.SCHOOL[formData.schoolLevel]?.length > 0 ? (
                    locations.SCHOOL[formData.schoolLevel].map((school) => (
                      <MenuItem key={school} value={school}>
                        {school}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled value="">
                      <Box sx={commonStyles.loadingContainer}>
                        {isLoadingLocations ? 'Loading schools...' : 'No schools available for this level'}
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
            </Grid>
          )}
        </>
      )}

      {/* SDO Department Selection */}
      {formData.location === 'SDO_IMUS_CITY' && (
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Department</InputLabel>
            <Select
              name="department"
              value={formData.department}
              onChange={handleChange}
              label="Department"
              disabled={loading || isLoadingLocations}
              MenuProps={MENU_PROPS}
            >
              {locations.SDO.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}
    </>
  );
};

export default LocationSection; 