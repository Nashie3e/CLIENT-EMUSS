import { useState, useCallback, useEffect, useRef } from 'react';

export const useNotifications = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

  // Handle notification close
  const handleNotificationClose = useCallback((event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowNotification(false);
    
    // Clear notification after fade out
    setTimeout(() => {
      setCurrentNotification(null);
    }, 300);
  }, []);

  // Store the latest handleNotificationClose in a ref to avoid dependency cycle
  const handleNotificationCloseRef = useRef(handleNotificationClose);
  useEffect(() => {
    handleNotificationCloseRef.current = handleNotificationClose;
  }, [handleNotificationClose]);

  // Auto-dismiss timer effect
  useEffect(() => {
    let dismissTimer;
    if (showNotification && currentNotification?.duration) {
      dismissTimer = setTimeout(() => {
        handleNotificationCloseRef.current(null, 'timeout');
      }, currentNotification.duration);
    }
    
    return () => {
      if (dismissTimer) clearTimeout(dismissTimer);
    };
  }, [showNotification, currentNotification]);

  // Add notification handling function
  const addNotification = useCallback((message, type = 'info', duration = 6000) => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      duration,
    };
    setCurrentNotification(newNotification);
    setShowNotification(true);
  }, []);

  return {
    showNotification,
    currentNotification,
    addNotification,
    handleNotificationClose
  };
}; 