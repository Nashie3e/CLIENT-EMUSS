import { useState, useCallback } from 'react';
import { INITIAL_FORM_DATA, EMAIL_REGEX } from '../constants';
import api from '../../../utils/api';

export const useTechnicalAssistanceForm = (taTypes, addNotification, captcha, generateCaptcha) => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userCaptcha, setUserCaptcha] = useState('');

  // Validate email
  const validateEmail = useCallback((email) => {
    return EMAIL_REGEX.test(email);
  }, []);

  // Handle form field changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
      ...(name === 'location' && {
        schoolLevel: '',
        schoolName: '',
        department: ''
      }),
      ...(name === 'schoolLevel' && {
        schoolName: ''
      })
    }));

    if (name === 'email') {
      if (!value) {
        setEmailError('Email is required');
      } else if (!validateEmail(value)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError('');
      }
    }
  }, [validateEmail]);

  // Get display values
  const getLocationDisplay = useCallback(() => {
    if (formData.location === 'SDO_IMUS_CITY') {
      return `SDO - Imus City - ${formData.department}`;
    } else if (formData.location === 'SCHOOL_IMUS_CITY') {
      return `${formData.schoolLevel} - ${formData.schoolName}`;
    }
    return '';
  }, [formData]);

  const getTATypeDisplay = useCallback(() => {
    if (formData.taType === 'others') {
      return formData.otherTaType || 'Others';
    }
    const selectedType = taTypes.find(type => type.id === parseInt(formData.taType));
    return selectedType ? selectedType.name : '';
  }, [formData, taTypes]);

  // Form validation
  const validateForm = useCallback(() => {
    if (!validateEmail(formData.email)) {
      addNotification('error', 'Please enter a valid email address', 6000);
      return false;
    }

    if (!userCaptcha) {
      addNotification('warning', 'Please enter the verification code', 6000);
      return false;
    }

    return true;
  }, [formData.email, userCaptcha, validateEmail, addNotification]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setShowConfirmation(true);
  }, [validateForm]);

  // Handle confirmed submission
  const handleConfirmSubmit = useCallback(async () => {
    setLoading(true);
    setShowConfirmation(false);

    try {
      // Prepare form data with default values for empty subject and message
      const submissionData = {
        ...formData,
        subject: formData.subject.trim() || 'No Message',
        message: formData.message.trim() || 'No Message',
        category: 'TECHNICAL_ASSISTANCE',
        captchaId: captcha.id,
        captchaCode: userCaptcha,
        ...(formData.taType === 'others' && { otherTaType: formData.otherTaType })
      };

      const response = await api.post('/tickets/technical-assistance', submissionData);

      if (response.data.success) {
        const { ticketId, trackingId } = response.data;
        addNotification('success', 
          `Technical assistance request submitted successfully!\nTicket #${ticketId}\nTracking ID: ${trackingId}`, 
          10000
        );
        
        // Reset form
        setFormData(INITIAL_FORM_DATA);
        setUserCaptcha('');
        generateCaptcha();
      } else {
        addNotification('error', response.data.message || 'Failed to create ticket', 6000);
        generateCaptcha();
      }
    } catch (err) {
      if (err.response?.status === 429) {
        const rateLimitInfo = err.response.data.rateLimitInfo;
        addNotification('error',
          `Rate limit exceeded. Please wait ${rateLimitInfo.cooldownMinutes} minutes.\nRemaining attempts: ${rateLimitInfo.remainingAttempts}`,
          15000
        );
      } else if (err.response?.status === 400 && err.response.data?.captchaError) {
        addNotification('warning',
          `Invalid CAPTCHA code. Please try again.\nRemaining attempts: ${err.response.data.remainingAttempts}`,
          8000
        );
        generateCaptcha();
      } else {
        const errorMessage = err.response?.data?.message || 'An error occurred while creating the ticket';
        addNotification('error', errorMessage, 8000);
        generateCaptcha();
      }
    } finally {
      setLoading(false);
    }
  }, [formData, captcha.id, userCaptcha, addNotification, generateCaptcha]);

  return {
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
    getTATypeDisplay,
    validateEmail
  };
}; 