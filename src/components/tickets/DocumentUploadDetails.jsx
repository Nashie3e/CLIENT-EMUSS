import React, { useState } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  Chip,
  Paper,
  IconButton,
  Modal,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Description as DescriptionIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const DocumentUploadDetails = ({ ticket, handleDownload }) => {
  const [showPreview, setShowPreview] = useState(false);

  // Helper function to safely render values
  const renderValue = (value) => {
    if (!value) return 'Not specified';
    if (typeof value === 'object') {
      if (value.name) return value.name;
      return JSON.stringify(value);
    }
    return String(value);
  };

  // Get file details from either documentPath or categorySpecificDetails
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

  const fileDetails = getFileDetails();

  // Function to get the embed URL from the Google Drive view URL
  const getEmbedUrl = (viewUrl) => {
    if (!viewUrl) return null;
    // Convert the view URL to an embed URL
    return viewUrl.replace('/view', '/preview');
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontFamily: 'Poppins' }}>
        <DescriptionIcon /> Document Information
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary={
              <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'Poppins' }}>
                Name
              </Box>
            }
            secondary={
                <Box component="span" sx={{ color: '#333', mt: 0.5, fontFamily: 'Poppins', display: 'block' }}>
                {renderValue(ticket.name)}
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
                <Box component="span" sx={{ color: '#333', mt: 0.5, fontFamily: 'Poppins', display: 'block' }}>
                {renderValue(ticket.email)}
              </Box>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'Poppins' }}>
                Location & Department
              </Box>
            }
            secondary={
              <Box component="span" sx={{ mt: 0.5 }}>
                {ticket.location ? (
                  <>
                    <Typography component="span" variant="body2" sx={{ fontFamily: 'Poppins' }}>
                      Location: {ticket.location.type === 'SCHOOL' ? 'School' : 'SDO'} - {ticket.location.type === 'SDO' ? 'Imus City' : ticket.location.name}
                    </Typography>
                    {ticket.location.type === 'SCHOOL' && (
                      <Typography component="span" variant="body2" sx={{ display: 'block', fontFamily: 'Poppins' }}>
                        School Level: {ticket.location.level || 'Not specified'}
                      </Typography>
                    )}
                    <Typography component="span" variant="body2" sx={{ display: 'block', fontFamily: 'Poppins' }}>
                      Department: {ticket.location.type === 'SDO' ? 'Information and Communications Technology Unit' : (ticket.department || 'Not specified')}
                    </Typography>
                  </>
                ) : (
                  <Typography component="span" variant="body2" sx={{ fontFamily: 'Poppins' }}>
                    Location not specified
                  </Typography>
                )}
              </Box>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'Poppins' }}>
                Document Subject
              </Box>
            }
            secondary={
              <Box component="span" sx={{ color: '#333', mt: 0.5, fontFamily: 'Poppins' }}>
                {renderValue(ticket.documentSubject || ticket.subject)}
              </Box>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'Poppins' }}>
                Document Type
              </Box>
            }
            secondary={
              <Box component="span" sx={{ color: '#333', mt: 0.5, fontFamily: 'Poppins' }}>
                {renderValue(ticket.documentType?.name || ticket.categorySpecificDetails?.details?.documentType)}
              </Box>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'Poppins' }}>
                Message
              </Box>
            }
            secondary={
              <Box component="span" sx={{ 
                color: '#333', 
                mt: 0.5,
                display: 'block',
                whiteSpace: 'pre-wrap',
                fontFamily: 'Poppins'
              }}>
                {renderValue(ticket.documentMessage || ticket.message)}
              </Box>
            }
          />
        </ListItem>
        {fileDetails && (
          <ListItem sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <ListItemText
              primary={
                <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'Poppins' }}>
                  Attached Document
                </Box>
              }
              secondary={
                <Box sx={{ mt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Chip
                      icon={<DescriptionIcon />}
                      label={fileDetails.name}
                      variant="outlined"
                      sx={{ maxWidth: '300px', '& .MuiChip-label': { fontFamily: 'Poppins' } }}
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
                    {(fileDetails.path || fileDetails.url) && (
                      <Button
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownload(fileDetails.path || fileDetails.url)}
                        size="small"
                        variant="contained"
                        sx={{ ml: 1, fontFamily: 'Poppins' }}
                      >
                        Download
                      </Button>
                    )}
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
              }
            />
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default DocumentUploadDetails; 