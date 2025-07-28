import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
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
import { useTechnicalAssistanceForm } from './hooks/useTechnicalAssistanceForm';

// Import components
import PersonalInformationSection from './components/PersonalInformationSection';
import RequestDetailsSection from './components/RequestDetailsSection';
import LocationSection from './components/LocationSection';
import MessageDetailsSection from './components/MessageDetailsSection';
import CaptchaSection from './components/CaptchaSection';
import ConfirmationDialog from './components/ConfirmationDialog';

// Import styles
import { containerStyles, formStyles, buttonStyles } from './styles';

const TechnicalAssistanceForm = () => {
  const navigate = useNavigate();
  const appVersion = process.env.REACT_APP_VERSION || '0.0.1 BETA';

  // Initialize hooks
  const { showNotification, currentNotification, addNotification, handleNotificationClose } = useNotifications();
  const { captcha, captchaError, captchaDisabled, generateCaptcha, handleRefreshCaptcha } = useCaptcha(addNotification);
  const { locations, isLoadingLocations, taTypes, isLoadingTATypes } = useDataLoading(addNotification);
  
  // Main form hook
  const {
    formData,
    loading,
    emailError,
    showConfirmation,
    setShowConfirmation,
    userCaptcha,
    setUserCaptcha,
    handleChange,
    handleSubmit,
    handleConfirmSubmit,
    getLocationDisplay,
    getTATypeDisplay
  } = useTechnicalAssistanceForm(taTypes, addNotification, captcha, generateCaptcha);

  return (
    <Container maxWidth="md" sx={containerStyles.main}>
      {/* Back Button */}
      <Box sx={{ 
        position: 'absolute',
        top: { xs: '10px', sm: '20px' },
        left: { xs: '10px', sm: '20px' },
        zIndex: 2
      }}>
        <BackButton 
          onClick={() => navigate('/tickets')} 
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '12px',
            padding: '8px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            }
          }}
        />
      </Box>

      {/* Header */}
      <Box sx={containerStyles.header}>
        <Typography variant="h4">
          Technical Assistance Request
        </Typography>
        <Typography variant="subtitle1" sx={{ 
          color: '#000000', 
          mt: 2, 
          fontFamily: 'Poppins',
          fontSize: '1.2rem',
          fontWeight: 500,
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Please fill out the form below to submit your technical assistance request
        </Typography>
      </Box>

      {/* Form */}
      <Paper elevation={3} sx={formStyles.paper}>
        {/* Loading Backdrop */}
        {loading && (
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
            open={loading}
          >
            <CircularProgress color="primary" />
            <Typography variant="body1" sx={{ mt: 2, color: 'text.primary', fontFamily: 'Poppins' }}>
              Submitting your request...
            </Typography>
          </Backdrop>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Personal Information Section */}
            <PersonalInformationSection
              formData={formData}
              emailError={emailError}
              loading={loading}
              handleChange={handleChange}
            />

            {/* Request Details Section */}
            <RequestDetailsSection
              formData={formData}
              taTypes={taTypes}
              isLoadingTATypes={isLoadingTATypes}
              loading={loading}
              handleChange={handleChange}
            />

            {/* Location Section */}
            <LocationSection
              formData={formData}
              locations={locations}
              isLoadingLocations={isLoadingLocations}
              loading={loading}
              handleChange={handleChange}
            />

            {/* Message Details Section */}
            <MessageDetailsSection
              formData={formData}
              loading={loading}
              handleChange={handleChange}
            />

            {/* CAPTCHA Section */}
            <CaptchaSection
              captchaCode={captcha.code}
              userCaptcha={userCaptcha}
              setUserCaptcha={setUserCaptcha}
              loadingCaptcha={captchaDisabled}
              loading={loading}
              generateNewCaptcha={handleRefreshCaptcha}
            />

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={buttonStyles.primary}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                    Submitting Request...
                  </Box>
                ) : (
                  'Review & Submit Request'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmSubmit}
        formData={formData}
        loading={loading}
        getLocationDisplay={getLocationDisplay}
        getTATypeDisplay={getTATypeDisplay}
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

export default TechnicalAssistanceForm; 