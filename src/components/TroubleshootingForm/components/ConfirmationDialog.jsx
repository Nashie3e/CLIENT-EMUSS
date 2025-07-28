import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Info as InfoIcon,
  Person as PersonIcon,
  LocationOn as LocationOnIcon,
  Build as BuildIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';
import { commonStyles } from '../styles';

const ConfirmationDialog = ({
  open,
  onClose,
  formData,
  getLocationDisplay,
  getEquipmentDisplay,
  formatDate,
  onConfirm,
  isSubmitting
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: { xs: '12px', sm: '16px' },
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          margin: { xs: 2, sm: 4 },
          maxHeight: { xs: '90vh', sm: '85vh' }
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#f8f8f8',
        borderBottom: '2px solid #e0e0e0',
        pb: { xs: 2, sm: 3 },
        pt: { xs: 2, sm: 3 },
        px: { xs: 2, sm: 4 },
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1, sm: 2 }
      }}>
        <Box
          sx={{
            width: { xs: 32, sm: 40 },
            height: { xs: 32, sm: 40 },
            borderRadius: { xs: '8px', sm: '12px' },
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <InfoIcon sx={{ 
            color: '#000000', 
            fontSize: { xs: '20px', sm: '24px' } 
          }} />
        </Box>
        <Typography variant="h5" sx={{ 
          color: '#000000',
          fontWeight: 600,
          fontSize: { xs: '1.2rem', sm: '1.5rem' },
          ...commonStyles.poppinsText
        }}>
          Review Your Request
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ 
        p: { xs: 2, sm: 4 },
        '&::-webkit-scrollbar': {
          width: '8px'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '4px'
        }
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: 3
        }}>
          {/* Personal Information Card */}
          <Paper sx={commonStyles.dialogCard}>
            <Typography variant="h6" sx={commonStyles.dialogCardTitle}>
              <PersonIcon sx={{ fontSize: '20px' }} />
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary" sx={commonStyles.poppinsText}>Name</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, ...commonStyles.poppinsText }}>{formData.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary" sx={commonStyles.poppinsText}>Email</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, ...commonStyles.poppinsText }}>{formData.email}</Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Location Information Card */}
          <Paper sx={commonStyles.dialogCard}>
            <Typography variant="h6" sx={commonStyles.dialogCardTitle}>
              <LocationOnIcon sx={{ fontSize: '20px' }} />
              Location Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary" sx={commonStyles.poppinsText}>Location</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, ...commonStyles.poppinsText }}>{getLocationDisplay()}</Typography>
              </Grid>
              {formData.locationType === 'SDO' && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary" sx={commonStyles.poppinsText}>Department</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, ...commonStyles.poppinsText }}>{formData.department}</Typography>
                </Grid>
              )}
            </Grid>
          </Paper>

          {/* Equipment Details Card */}
          <Paper sx={commonStyles.dialogCard}>
            <Typography variant="h6" sx={commonStyles.dialogCardTitle}>
              <BuildIcon sx={{ fontSize: '20px' }} />
              Equipment Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary" sx={commonStyles.poppinsText}>Equipment</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, ...commonStyles.poppinsText }}>{getEquipmentDisplay()}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary" sx={commonStyles.poppinsText}>Serial No.</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, ...commonStyles.poppinsText }}>{formData.serialNo}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary" sx={commonStyles.poppinsText}>Date of Request</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, ...commonStyles.poppinsText }}>{formatDate(formData.dateOfRequest)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary" sx={commonStyles.poppinsText}>Priority</Typography>
                <Chip 
                  label={formData.priority}
                  color={formData.priority === 'HIGH' ? 'error' : formData.priority === 'MEDIUM' ? 'warning' : 'default'}
                  size="small"
                  sx={{ mt: 0.5, fontWeight: 500, ...commonStyles.poppinsText }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Problem Description Card */}
          <Paper sx={commonStyles.dialogCard}>
            <Typography variant="h6" sx={commonStyles.dialogCardTitle}>
              <DescriptionIcon sx={{ fontSize: '20px' }} />
              Problem Description
            </Typography>
            {formData.specificProblem ? (
              <Typography variant="body1" sx={{ 
                whiteSpace: 'pre-wrap', 
                lineHeight: 1.6,
                backgroundColor: '#f8f8f8',
                p: 2,
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                ...commonStyles.poppinsText
              }}>
                {formData.specificProblem}
              </Typography>
            ) : (
              <Typography variant="body2" color="textSecondary" sx={commonStyles.poppinsText}>
                No problem description provided
              </Typography>
            )}
          </Paper>

          {/* Attachment Card */}
          <Paper sx={commonStyles.dialogCard}>
            <Typography variant="h6" sx={commonStyles.dialogCardTitle}>
              <AttachFileIcon sx={{ fontSize: '20px' }} />
              Attachment
            </Typography>
            {formData.file ? (
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                backgroundColor: '#f8f8f8',
                p: 2,
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                ...commonStyles.poppinsText
              }}>
                <AttachFileIcon sx={{ color: '#666666' }} />
                <Typography variant="body1" sx={{ fontWeight: 500, ...commonStyles.poppinsText }}>
                  {formData.file.name}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary" sx={commonStyles.poppinsText}>
                No file attached
              </Typography>
            )}
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        p: { xs: 2, sm: 3 },
        backgroundColor: '#f8f8f8',
        borderTop: '1px solid #e0e0e0',
        gap: { xs: 1, sm: 2 },
        flexDirection: { xs: 'column', sm: 'row' },
        '& .MuiButton-root': {
          width: { xs: '100%', sm: 'auto' }
        }
      }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          startIcon={<EditIcon />}
          sx={{ 
            borderColor: '#000000',
            color: '#000000',
            '&:hover': {
              borderColor: '#333333',
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          Edit Details
        </Button>
        <Button 
          onClick={onConfirm}
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : <CheckCircleIcon />}
          sx={{
            background: '#000000',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            px: 4,
            '&:hover': {
              background: '#333333',
            }
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog; 