import { useState, useCallback } from 'react';
import axios from 'axios';
import { validateTrackingId, validateEmail, API_BASE_URL } from '../utils';

export const useTrackTicket = (addNotification) => {
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [formData, setFormData] = useState({
    trackingId: '',
    email: '',
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setTicket(null);
  }, []);

  const setPrefilledData = useCallback((trackingId) => {
    setFormData(prev => ({
      ...prev,
      trackingId: trackingId
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setTicket(null);

    try {
      // Validate inputs
      if (!formData.trackingId || !formData.email) {
        addNotification(
          'Please fill in both Tracking ID and Email Address fields',
          'warning',
          6000
        );
        setLoading(false);
        return;
      }

      // Validate tracking ID format (TK-XXXXXXXX)
      if (!validateTrackingId(formData.trackingId)) {
        addNotification(
          'Invalid tracking ID format. Expected format: TK-XXXXXXXX',
          'error',
          6000
        );
        setLoading(false);
        return;
      }

      // Validate email format
      if (!validateEmail(formData.email)) {
        addNotification('Please enter a valid email address', 'error', 6000);
        setLoading(false);
        return;
      }

      addNotification('Searching for your ticket...', 'info', 2000);

      const response = await axios.post(`${API_BASE_URL}/tickets/track`, {
        trackingId: formData.trackingId.trim(),
        email: formData.email.trim().toLowerCase()
      });

      if (response.data.success) {
        setTicket(response.data.ticket);
        addNotification('Ticket found successfully!', 'success');
      } else {
        addNotification(
          `Ticket not found. Please ensure your tracking ID (format: TK-XXXXXXXX) and email are correct.`, 
          'error'
        );
      }
    } catch (error) {
      console.error('Error tracking ticket:', error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Failed to track ticket. Please try again.';
      addNotification(errorMessage, 'error', 8000);
    } finally {
      setLoading(false);
    }
  }, [formData, addNotification]);

  // Handle document download
  const handleDownload = useCallback(async () => {
    try {
      setLoading(true);
      let filePath = null;
      let fileName = null;
      
      if (ticket.categorySpecificDetails?.details?.fileName) {
        filePath = ticket.categorySpecificDetails.details.fileName;
        fileName = ticket.categorySpecificDetails.details.originalFileName || filePath;
      }
      
      if (!filePath) {
        throw new Error('No document attached to this ticket');
      }
      
      addNotification('Starting download...', 'info', 2000);
      
      const response = await axios.get(`${API_BASE_URL}/documents/public/${filePath}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      addNotification('Document downloaded successfully!', 'success');
    } catch (err) {
      console.error('Download error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to download document';
      addNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [ticket, addNotification]);

  return {
    loading,
    ticket,
    formData,
    handleChange,
    handleSubmit,
    handleDownload,
    setPrefilledData
  };
}; 