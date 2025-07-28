import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Container } from '@mui/material';

// Import hooks
import { useNotifications } from './hooks/useNotifications';
import { useTrackTicket } from './hooks/useTrackTicket';
import { useChatSupport } from './hooks/useChatSupport';

// Import components
import {
  Header,
  TrackingForm,
  TicketDetails,
  Footer,
  ChatSupport
} from './components';

// Import notification system
import NotificationSystem from '../TroubleshootingForm/components/NotificationSystem';

// Import styles
import { containerStyles } from './styles';

const TrackTicket = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize hooks
  const {
    showNotification,
    currentNotification,
    addNotification,
    handleNotificationClose
  } = useNotifications();

  const {
    loading,
    ticket,
    formData,
    handleChange,
    handleSubmit,
    handleDownload,
    setPrefilledData
  } = useTrackTicket(addNotification);

  const {
    isChatOpen,
    chatStep,
    handleChatToggle,
    navigateToStep,
    goBackToMain
  } = useChatSupport();

  // Handle prefilled tracking ID from notification
  useEffect(() => {
    if (location.state?.prefilledTrackingId) {
      setPrefilledData(location.state.prefilledTrackingId);
      
      // Show notification about prefilled data
      if (location.state?.fromNotification) {
        addNotification('Tracking ID has been filled automatically. Please enter your email to continue.', 'info', 4000);
      }
      
      // Clear the state to prevent it from persisting on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, addNotification, setPrefilledData]);

  return (
    <Box sx={containerStyles.main}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <Container maxWidth="md" sx={containerStyles.content}>
        {/* Tracking Form */}
        <TrackingForm
          formData={formData}
          loading={loading}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />

        {/* Ticket Details */}
        <TicketDetails
          ticket={ticket}
          loading={loading}
          handleDownload={handleDownload}
        />

        {/* Footer */}
        <Footer ticket={ticket} />
      </Container>

      {/* Chat Support */}
      <ChatSupport
        isChatOpen={isChatOpen}
        chatStep={chatStep}
        handleChatToggle={handleChatToggle}
        navigateToStep={navigateToStep}
        goBackToMain={goBackToMain}
      />

      {/* Notification System */}
      <NotificationSystem
        showNotification={showNotification}
        currentNotification={currentNotification}
        handleNotificationClose={handleNotificationClose}
      />
    </Box>
  );
};

export default TrackTicket; 