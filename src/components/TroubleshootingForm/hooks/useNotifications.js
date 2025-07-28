import { useState, useCallback } from 'react';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

  // Add notification handler
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

  return {
    notifications,
    showNotification,
    currentNotification,
    addNotification,
    handleNotificationClose
  };
}; 