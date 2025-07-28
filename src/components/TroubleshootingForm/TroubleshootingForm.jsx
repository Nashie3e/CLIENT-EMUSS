import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import BackButton from '../BackButton';
import api from '../../utils/api';

// Import custom hooks
import { useTroubleshootingForm } from './hooks/useTroubleshootingForm';
import { useNotifications } from './hooks/useNotifications';
import { useCaptcha } from './hooks/useCaptcha';
import { useLocations } from './hooks/useLocations';

// Import components
import PersonalInformationSection from './components/PersonalInformationSection';
import LocationSection from './components/LocationSection';
import EquipmentSection from './components/EquipmentSection';
import MessageAndAttachmentSection from './components/MessageAndAttachmentSection';
import CaptchaSection from './components/CaptchaSection';
import ConfirmationDialog from './components/ConfirmationDialog';
import NotificationSystem from './components/NotificationSystem';

// Import styles
import { containerStyles, formStyles, buttonStyles, commonStyles } from './styles';

const TroubleshootingForm = () => {
  const navigate = useNavigate();
  const appVersion = process.env.REACT_APP_VERSION;

  // State management
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Custom hooks
  const {
    formData,
    setFormData,
    emailError,
    handleChange,
    handleFileChange,
    resetForm,
    getLocationDisplay,
    getEquipmentDisplay,
    formatDate,
    validateEmail
  } = useTroubleshootingForm();

  const {
    showNotification,
    currentNotification,
    addNotification,
    handleNotificationClose
  } = useNotifications();

  const {
    captcha,
    captchaError,
    captchaDisabled,
    setCaptchaError,
    generateCaptcha,
    handleRefreshCaptcha
  } = useCaptcha(addNotification);

  const {
    locations,
    locationsLoading,
    locationsError
  } = useLocations(addNotification);

  // Form submission handlers
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setMessage(null);
    setCaptchaError(null);

    // Validate email before showing confirmation
    if (!validateEmail(formData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    // Validate CAPTCHA input
    if (!formData.captchaCode) {
      setMessage({ type: 'error', text: 'Please enter the verification code' });
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmation(false);
    setIsSubmitting(true);
    setMessage(null);
    setCaptchaError(null);

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      const finalModelOfEquipment = formData.modelOfEquipment === 'Other' ? formData.customModel : formData.modelOfEquipment;

      // Get the correct location name based on type
      let locationName;
      if (formData.locationType === 'SDO') {
        locationName = formData.department;
      } else {
        locationName = formData.schoolName;
      }

      const ticketData = {
        category: 'TROUBLESHOOTING',
        name: formData.name,
        email: formData.email,
        department: formData.locationType === 'SDO' ? formData.department : null,
        location: locationName,
        schoolLevel: formData.locationType === 'SCHOOL' ? formData.schoolLevel : null,
        schoolName: formData.locationType === 'SCHOOL' ? formData.schoolName : null,
        dateOfRequest: formData.dateOfRequest,
        typeOfEquipment: formData.typeOfEquipment === 'Others' ? formData.customEquipmentType : formData.typeOfEquipment,
        modelOfEquipment: finalModelOfEquipment,
        serialNo: formData.serialNo,
        specificProblem: formData.specificProblem || '',
        priority: formData.priority,
        captchaId: captcha.id,
        captchaCode: formData.captchaCode
      };

      formDataToSend.append('ticketData', JSON.stringify(ticketData));
      
      // Append file if exists
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }

      const response = await api.post('/tickets/troubleshooting', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const { ticketId, trackingId } = response.data;
      
      addNotification('success', 
        `Ticket #${ticketId} created successfully! Tracking ID: ${trackingId}`, 
        10000
      );

      // Reset form
      resetForm();
      generateCaptcha();

    } catch (error) {
      console.error('Error submitting ticket:', error);
      const errorMessage = error.response?.data?.message || 'Unable to submit request';
      
      if (error.response?.status === 429) {
        const rateLimitInfo = error.response.data.rateLimitInfo;
        addNotification('error', 
          `Rate limit exceeded. Please wait ${rateLimitInfo.cooldownMinutes} minutes. ` +
          `Remaining attempts: ${rateLimitInfo.remainingAttempts}`, 
          15000
        );
      } else if (error.response?.status === 400 && error.response.data?.captchaError) {
        setCaptchaError(error.response.data.message);
        addNotification('warning', 
          `Invalid CAPTCHA code. Please try again. ${error.response.data.remainingAttempts} attempts remaining.`, 
          8000
        );
        generateCaptcha();
      } else {
        addNotification('error', `Error: ${errorMessage}`, 10000);
        generateCaptcha();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
            borderRadius: '8px',
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
          fontSize: { xs: '1.8rem', sm: '2.5rem' },
          fontFamily: 'Poppins',
          position: 'relative',
          display: 'inline-block',
          mb: { xs: 2, sm: 3 },
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            width: { xs: '80px', sm: '120px' },
            height: { xs: 3, sm: 4 },
            backgroundColor: '#000000',
            borderRadius: 2,
          }
        }}>
          Troubleshooting Form
        </Typography>
        <Typography variant="subtitle1" sx={{ 
          color: '#000000', 
          fontFamily: 'Poppins',
          fontSize: { xs: '1rem', sm: '1.2rem' },
          fontWeight: 500,
          maxWidth: '600px',
          margin: '0 auto',
          px: { xs: 2, sm: 0 }
        }}>
          Please fill out the form below to submit your troubleshooting request
        </Typography>
      </Box>

      {/* Main Form */}
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
            <Typography variant="body1" sx={{ mt: 2, color: 'text.primary', ...commonStyles.poppinsText }}>
              Submitting your request...
            </Typography>
          </Backdrop>
        )}

        {/* Error Messages */}
        {message && (
          <Alert 
            severity={message.type} 
            sx={{ 
              mb: 3,
              borderRadius: 1,
              '& .MuiAlert-icon': {
                fontSize: '1.5rem'
              }
            }}
          >
            {message.text}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Box sx={formStyles.grid}>
            {/* Personal Information Section */}
            <PersonalInformationSection
              formData={formData}
              handleChange={handleChange}
              emailError={emailError}
              isSubmitting={isSubmitting}
            />

            {/* Location Section */}
            <LocationSection
              formData={formData}
              handleChange={handleChange}
              locations={locations}
              locationsLoading={locationsLoading}
              locationsError={locationsError}
              isSubmitting={isSubmitting}
            />

            {/* Equipment Section */}
            <EquipmentSection
              formData={formData}
              handleChange={handleChange}
              isSubmitting={isSubmitting}
            />

            {/* Message and Attachment Section */}
            <MessageAndAttachmentSection
              formData={formData}
              handleChange={handleChange}
              handleFileChange={handleFileChange}
              addNotification={addNotification}
              isSubmitting={isSubmitting}
            />

            {/* CAPTCHA Section */}
            <CaptchaSection
              formData={formData}
              setFormData={setFormData}
              captcha={captcha}
              captchaError={captchaError}
              captchaDisabled={captchaDisabled}
              handleRefreshCaptcha={handleRefreshCaptcha}
              isSubmitting={isSubmitting}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              className="full-width"
              disabled={isSubmitting}
              sx={buttonStyles.submit}
            >
              {isSubmitting ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
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
        formData={formData}
        getLocationDisplay={getLocationDisplay}
        getEquipmentDisplay={getEquipmentDisplay}
        formatDate={formatDate}
        onConfirm={handleConfirmSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Notification System */}
      <NotificationSystem
        showNotification={showNotification}
        currentNotification={currentNotification}
        handleNotificationClose={handleNotificationClose}
      />

      {/* Version Footer */}
      <Box 
        sx={{ 
          width: '100%',
          textAlign: 'center',
          mt: 'auto',
          mb: 2,
          py: 1
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            color: '#FFFFFF',
            fontStyle: 'italic',
            ...commonStyles.poppinsText
          }}
        >
          version {appVersion}
        </Typography>
      </Box>
    </Container>
  );
};

export default TroubleshootingForm; 