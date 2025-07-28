import React, { useState } from 'react';
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  IconButton,
  Paper,
  Chip,
  Modal,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Description as DescriptionIcon,
  AttachFile as AttachFileIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const TroubleshootingDetails = ({ ticket, formatDate, handleDownload }) => {
  const [showPreview, setShowPreview] = useState(false);

  // Get file details from either documentPath or Google Drive
  const getFileDetails = () => {
    // First check for Google Drive file details
    if (ticket.driveFileUrl) {
      return {
        url: ticket.driveFileUrl,
        name: ticket.driveFileName || 'Attached Document',
        isGoogleDrive: true
      };
    }
    // Then check for legacy file paths
    if (ticket.documentPath) {
      return {
        path: ticket.documentPath,
        name: ticket.documentPath.split('/').pop(),
        isGoogleDrive: false
      };
    }
    if (ticket.categorySpecificDetails?.details?.fileUrl) {
      return {
        url: ticket.categorySpecificDetails.details.fileUrl,
        name: ticket.categorySpecificDetails.details.fileName || 'Attached Document',
        isGoogleDrive: true
      };
    }
    return null;
  };

  // Function to get the embed URL from the Google Drive view URL
  const getEmbedUrl = (viewUrl) => {
    if (!viewUrl) return null;
    // Convert the view URL to an embed URL
    return viewUrl.replace('/view', '/preview');
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const fileDetails = getFileDetails();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography 
          variant="subtitle1" 
          sx={{
            fontWeight: 600,
            color: '#1976d2',
            mb: 2,
            fontFamily: 'Poppins'
          }}
        >
          Technical Issue Details
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <List>
          <ListItem>
            <ListItemText
              primary={
                <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'Poppins' }}>
                  Name
                </Box>
              }
              secondary={
                <Box component="span" sx={{ color: '#333', mt: 0.5, fontFamily: 'Poppins' }}>
                  {ticket.name || 'N/A'}
                </Box>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={
                <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'Poppins' }}>
                  Email
                </Box>
              }
              secondary={
                <Box component="span" sx={{ color: '#333', mt: 0.5, fontFamily: 'Poppins' }}>
                  {ticket.email || 'N/A'}
                </Box>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={
                <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'Poppins' }}>
                  Location
                </Box>
              }
              secondary={
                <Box component="span" sx={{ color: '#333', mt: 0.5, fontFamily: 'Poppins' }}>
                  {ticket.location?.type === 'SCHOOL' ? 'School - Imus City' : 'SDO - Imus City'}
                </Box>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={
                <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'Poppins' }}>
                  Date of Request
                </Box>
              }
              secondary={
                <Box component="span" sx={{ color: '#333', mt: 0.5, fontFamily: 'Poppins' }}>
                  {ticket.dateOfRequest ? formatDate(ticket.dateOfRequest) : 'N/A'}
                </Box>
              }
            />
          </ListItem>
        </List>
      </Grid>
      <Grid item xs={12} md={6}>
        <List>
          <ListItem>
            <ListItemText
              primary={
                <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'Poppins' }}>
                  Type of Equipment
                </Box>
              }
              secondary={
                <Box component="span" sx={{ color: '#333', mt: 0.5, fontFamily: 'Poppins' }}>
                  {ticket.typeOfEquipment || 'N/A'}
                </Box>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={
                <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'Poppins' }}>
                  Model of Equipment
                </Box>
              }
              secondary={
                <Box component="span" sx={{ color: '#333', mt: 0.5, fontFamily: 'Poppins' }}>
                  {ticket.modelOfEquipment || 'N/A'}
                </Box>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={
                <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'Poppins' }}>
                  Serial No.
                </Box>
              }
              secondary={
                <Box component="span" sx={{ color: '#333', mt: 0.5, fontFamily: 'Poppins' }}>
                  {ticket.serialNo || 'N/A'}
                </Box>
              }
            />
          </ListItem>
        </List>
      </Grid>
      <Grid item xs={12}>
        <List>
          <ListItem>
            <ListItemText
              primary={
                <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'Poppins' }}>
                  Specific Problem
                </Box>
              }
              secondary={
                <Box component="span" sx={{ 
                  color: '#333', 
                  mt: 0.5,
                  bgcolor: 'white',
                  p: 2,
                  borderRadius: '4px',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  display: 'block',
                  whiteSpace: 'pre-wrap',
                  width: '100%',
                  fontFamily: 'Poppins'
                }}>
                  {ticket.specificProblem || 'Not provided'}
                </Box>
              }
            />
          </ListItem>
        </List>
      </Grid>
      {fileDetails && (
        <Grid item xs={12}>
          <Box sx={{ mt: 2 }}>
            <Typography 
              variant="subtitle1" 
              sx={{
                fontWeight: 600,
                color: '#1976d2',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontFamily: 'Poppins'
              }}
            >
              <AttachFileIcon /> Attached File
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Chip
                  icon={<DescriptionIcon />}
                  label={fileDetails.name}
                  variant="outlined"
                  sx={{ maxWidth: '300px', fontFamily: 'Poppins' }}
                />
                {fileDetails.isGoogleDrive && (
                  <IconButton
                    onClick={togglePreview}
                    color="primary"
                    size="small"
                    sx={{ ml: 1 }}
                  >
                    {showPreview ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                )}
                <Button
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownload(fileDetails.path || fileDetails.url)}
                  size="small"
                  variant="contained"
                  sx={{ ml: 1, fontFamily: 'Poppins' }}
                >
                  Download
                </Button>
              </Box>

              {/* File Preview Modal */}
              {fileDetails.isGoogleDrive && (
                <Modal
                  open={showPreview}
                  onClose={togglePreview}
                  aria-labelledby="document-preview-modal"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                  }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      position: 'relative',
                      width: '90%',
                      maxWidth: '1200px',
                      maxHeight: '90vh',
                      overflow: 'hidden',
                      borderRadius: 1,
                      bgcolor: 'background.paper',
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                    }}
                  >
                    <IconButton
                      onClick={togglePreview}
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                        },
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <Box
                      sx={{
                        position: 'relative',
                        paddingTop: '56.25%', // 16:9 aspect ratio
                        width: '100%',
                      }}
                    >
                      <iframe
                        src={getEmbedUrl(fileDetails.url)}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          border: 'none',
                        }}
                        allow="autoplay"
                        allowFullScreen
                        title="Document Preview"
                      />
                    </Box>
                  </Paper>
                </Modal>
              )}
            </Box>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default TroubleshootingDetails; 