// Date formatting utility
export const formatDate = (dateString) => {
  if (!dateString) return 'Not available';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Status color utilities
export const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'PENDING':
      return '#666666';
    case 'IN_PROGRESS':
      return '#333333';
    case 'RESOLVED':
      return '#000000';
    case 'CANCELLED':
      return '#999999';
    default:
      return '#757575';
  }
};

export const getPriorityColor = (priority) => {
  switch (priority?.toUpperCase()) {
    case 'HIGH':
      return '#000000';
    case 'MEDIUM':
      return '#333333';
    case 'LOW':
      return '#666666';
    default:
      return '#757575';
  }
};

// Validation utilities
export const validateTrackingId = (trackingId) => {
  const trackingIdRegex = /^TK-[A-Z0-9]+$/;
  return trackingIdRegex.test(trackingId);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// API configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'; 