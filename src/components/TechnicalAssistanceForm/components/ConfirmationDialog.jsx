import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Info as InfoIcon,
  Person as PersonIcon,
  Build as BuildIcon,
  LocationOn as LocationOnIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { dialogStyles, commonStyles } from '../styles';

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  formData,
  loading,
  getLocationDisplay,
  getTATypeDisplay
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: dialogStyles.paper }}
    >
      <DialogTitle sx={dialogStyles.title}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <InfoIcon sx={{ color: '#000000', fontSize: '24px' }} />
        </Box>
        <Typography variant="h5" sx={{ 
          color: '#000000',
          fontWeight: 600,
          ...commonStyles.poppinsText,
          fontSize: '1.5rem'
        }}>
          Review Your Request
        </Typography>
      </DialogTitle>

      <DialogContent sx={dialogStyles.content}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: 3
        }}>
          {/* Personal Information Card */}
          <Paper sx={{ 
            p: 3, 
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            backgroundColor: '#ffffff'
          }}>
            <Typography variant="h6" sx={commonStyles.cardTitle}>
              <PersonIcon sx={{ fontSize: '20px' }} />
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Name</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{formData.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{formData.email}</Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Request Details Card */}
          <Paper sx={{ 
            p: 3, 
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            backgroundColor: '#ffffff'
          }}>
            <Typography variant="h6" sx={commonStyles.cardTitle}>
              <BuildIcon sx={{ fontSize: '20px' }} />
              Request Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">TA Type</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{getTATypeDisplay()}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Priority</Typography>
                <Chip 
                  label={formData.priority}
                  color={formData.priority === 'HIGH' ? 'error' : formData.priority === 'MEDIUM' ? 'warning' : 'default'}
                  size="small"
                  sx={{ mt: 0.5, fontWeight: 500 }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Location Details Card */}
          <Paper sx={{ 
            p: 3, 
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            backgroundColor: '#ffffff'
          }}>
            <Typography variant="h6" sx={commonStyles.cardTitle}>
              <LocationOnIcon sx={{ fontSize: '20px' }} />
              Location Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">Location</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{getLocationDisplay()}</Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Message Details Card */}
          <Paper sx={{ 
            p: 3, 
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            backgroundColor: '#ffffff'
          }}>
            <Typography variant="h6" sx={commonStyles.cardTitle}>
              <DescriptionIcon sx={{ fontSize: '20px' }} />
              Message Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">Subject</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{formData.subject}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">Message</Typography>
                <Typography variant="body1" sx={{ 
                  whiteSpace: 'pre-wrap', 
                  lineHeight: 1.6,
                  backgroundColor: '#f8f8f8',
                  p: 2,
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
                }}>
                  {formData.message}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions sx={dialogStyles.actions}>
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
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
          sx={{
            background: '#000000',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            px: 4,
            '&:hover': {
              background: '#333333',
            }
          }}
        >
          {loading ? 'Submitting...' : 'Confirm & Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog; 