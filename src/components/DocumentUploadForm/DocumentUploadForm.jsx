import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Backdrop
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BackButton from '../BackButton';
import NotificationSystem from '../TroubleshootingForm/components/NotificationSystem';

// Import hooks
import { useNotifications } from './hooks/useNotifications';
import { useCaptcha } from './hooks/useCaptcha';
import { useDataLoading } from './hooks/useDataLoading';
import { useDocumentUploadForm } from './hooks/useDocumentUploadForm';

// Import components
import PersonalInformationSection from './components/PersonalInformationSection';
import RequestDetailsSection from './components/RequestDetailsSection';
import DocumentDetailsSection from './components/DocumentDetailsSection';
import FileUploadSection from './components/FileUploadSection';
import CaptchaSection from './components/CaptchaSection';
import ConfirmationDialog from './components/ConfirmationDialog';

// Import styles
import { containerStyles, formStyles, buttonStyles } from './styles';

const DocumentUploadForm = () => {
  const navigate = useNavigate();
  const appVersion = process.env.REACT_APP_VERSION;

  // Initialize hooks
  const { showNotification, currentNotification, addNotification, handleNotificationClose } = useNotifications();
  const { captcha, captchaError, captchaDisabled, setCaptchaError, generateCaptcha, handleRefreshCaptcha } = useCaptcha(addNotification);
  const { locations, isLoadingLocations, documentTypes, isLoadingDocumentTypes } = useDataLoading(addNotification);
  
  // Main form hook
  const {
    formData,
    isSubmitting,
    emailError,
    showConfirmation,
    setShowConfirmation,
    handleChange,
    handleFileChange,
    handleSubmit,
    handleConfirmSubmit,
    getLocationDisplay,
    getDocumentTypeDisplay
  } = useDocumentUploadForm(documentTypes, addNotification, generateCaptcha, captcha);

  return (
    <Container maxWidth="md" sx={containerStyles.main}>
      {/* Back Button */}
      <Box sx={{ 
        position: 'absolute',
        top: { xs: '5px', sm: '20px' },
        left: { xs: '5px', sm: '20px' },
        zIndex: 2
      }}>
        <BackButton 
          onClick={() => navigate('/tickets')} 
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: { xs: '8px', sm: '12px' },
            padding: { xs: '4px', sm: '8px' },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            }
          }}
        />
      </Box>

      {/* Header */}
      <Box sx={containerStyles.header}>
        <Typography variant="h4" sx={{
          color: '#000000',
          fontWeight: 800,
          fontSize: { xs: '1.5rem', sm: '2.5rem' },
          fontFamily: 'Poppins',
          position: 'relative',
          display: 'inline-block',
          mb: { xs: 1.5, sm: 3 },
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: { xs: '60px', sm: '120px' },
            height: { xs: 2, sm: 4 },
            backgroundColor: '#000000',
            borderRadius: 2,
          }
        }}>
          Uploading of Publication
        </Typography>
        <Typography variant="subtitle1" sx={{ 
          color: '#000000', 
          mt: 2, 
          fontFamily: 'Poppins',
          fontSize: { xs: '1rem', sm: '1.2rem' },
          fontWeight: 500,
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Please fill out the form below to submit your document upload request
        </Typography>
      </Box>

      {/* Form */}
      <Paper elevation={3} sx={formStyles.paper}>
        {/* Loading Backdrop */}
        {isSubmitting && (
          <Backdrop
            sx={{
              position: 'absolute',
              color: '#fff',
              zIndex: 1,
              background: 'rgba(255, 255, 255, 0.7)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 2,
            }}
            open={isSubmitting}
          >
            <CircularProgress color="primary" />
            <Typography variant="body1" sx={{ mt: 2, color: 'text.primary', fontFamily: 'Poppins' }}>
              Submitting your request...
            </Typography>
          </Backdrop>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{
            ...formStyles.grid,
            ...formStyles.fieldStyles
          }}>
            {/* Personal Information Section */}
            <PersonalInformationSection
              formData={formData}
              emailError={emailError}
              isSubmitting={isSubmitting}
              handleChange={handleChange}
            />

            {/* Request Details Section */}
            <RequestDetailsSection
              formData={formData}
              documentTypes={documentTypes}
              isLoadingDocumentTypes={isLoadingDocumentTypes}
              locations={locations}
              isLoadingLocations={isLoadingLocations}
              isSubmitting={isSubmitting}
              handleChange={handleChange}
            />

            {/* Document Details Section */}
            <DocumentDetailsSection
              formData={formData}
              isSubmitting={isSubmitting}
              handleChange={handleChange}
            />

            {/* File Upload Section */}
            <FileUploadSection
              formData={formData}
              handleFileChange={handleFileChange}
            />

            {/* CAPTCHA Section */}
            <CaptchaSection
              formData={formData}
              captcha={captcha}
              captchaError={captchaError}
              captchaDisabled={captchaDisabled}
              isSubmitting={isSubmitting}
              handleChange={handleChange}
              handleRefreshCaptcha={handleRefreshCaptcha}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              className="full-width"
              disabled={isSubmitting}
              sx={buttonStyles.primary}
            >
              {isSubmitting ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                  Submitting Request...
                </Box>
              ) : (
                'Review & Submit Request'
              )}
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmSubmit}
        formData={formData}
        documentTypes={documentTypes}
        isSubmitting={isSubmitting}
        getLocationDisplay={getLocationDisplay}
        getDocumentTypeDisplay={getDocumentTypeDisplay}
      />

      {/* Enhanced Notification System */}
      <NotificationSystem
        showNotification={showNotification}
        currentNotification={currentNotification}
        handleNotificationClose={handleNotificationClose}
      />

      {/* Version Display */}
      <Box sx={{ width: '100%', textAlign: 'center', mt: 'auto', mb: 2, py: 1 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            fontFamily: 'Poppins',
            color: '#FFFFFF',
            fontStyle: 'italic'
          }}
        >
          version {appVersion}
        </Typography>
      </Box>
    </Container>
  );
};

export default DocumentUploadForm; 