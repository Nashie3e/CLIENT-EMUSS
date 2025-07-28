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
import { PRIORITIES, LOCATION_TYPES } from '../constants';
import { commonStyles } from '../styles';

const RequestDetailsSection = ({ 
  formData,
  documentTypes,
  isLoadingDocumentTypes,
  locations,
  isLoadingLocations,
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

      <FormControl required>
        <InputLabel>Location</InputLabel>
        <Select
          name="locationType"
          value={formData.locationType}
          onChange={handleChange}
          label="Location"
          disabled={isSubmitting}
          sx={{ fontSize: '0.9rem' }}
        >
          {LOCATION_TYPES.map((location) => (
            <MenuItem key={location.value} value={location.value}>
              {location.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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

      {/* Document Type Selection */}
      <FormControl required className="full-width">
        <InputLabel>Document Type</InputLabel>
        <Select
          name="documentType"
          value={formData.documentType}
          onChange={handleChange}
          label="Document Type"
          disabled={isSubmitting || isLoadingDocumentTypes}
          sx={{ fontSize: '0.9rem' }}
        >
          {documentTypes.map((type) => (
            <MenuItem key={type.id} value={type.id}>
              {type.name}
            </MenuItem>
          ))}
        </Select>
        {isLoadingDocumentTypes && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <CircularProgress size={16} sx={{ mr: 1 }} />
            <Typography variant="caption" color="text.secondary">
              Loading document types...
            </Typography>
          </Box>
        )}
      </FormControl>
    </>
  );
};

export default RequestDetailsSection; 