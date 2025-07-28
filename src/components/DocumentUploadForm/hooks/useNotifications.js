import { useState, useCallback, useEffect, useRef } from 'react';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  
  // Handle notification close
  const handleNotificationClose = useCallback((event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowNotification(false);
    
    // Show next notification if there are more
    setTimeout(() => {
      const remainingNotifications = notifications.filter(n => n.id !== currentNotification?.id);
      setNotifications(remainingNotifications);
      
      if (remainingNotifications.length > 0) {
        setCurrentNotification(remainingNotifications[0]);
        setShowNotification(true);
      } else {
        setCurrentNotification(null);
      }
    }, 300);
  }, [notifications, currentNotification]);

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

  // Add notification
  const addNotification = useCallback((type, message, duration = 6000) => {
    const id = Date.now();
    const newNotification = {
      id,
      type,
      message,
      duration,
    };
    setNotifications(prev => [...prev, newNotification]);
    
    if (!showNotification) {
      setCurrentNotification(newNotification);
      setShowNotification(true);
    }
  }, [showNotification]);

  return {
    showNotification,
    currentNotification,
    addNotification,
    handleNotificationClose
  };
}; 