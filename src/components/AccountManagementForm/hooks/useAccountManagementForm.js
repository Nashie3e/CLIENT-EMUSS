import { useState, useCallback } from 'react';
import { INITIAL_FORM_DATA, EMAIL_REGEX } from '../constants';
import api from '../../../utils/api';

export const useAccountManagementForm = (accountTypes, addNotification, generateCaptcha, captcha) => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Validate email
  const validateEmail = useCallback((email) => {
    return EMAIL_REGEX.test(email);
  }, []);

  // Handle form field changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'actionType' && { accountType: '' }),
      ...(name === 'locationType' && { schoolLevel: '', schoolName: '' }),
      ...(name === 'schoolLevel' && { schoolName: '' })
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

  // Handle checkbox change
  const handleCheckboxChange = useCallback((checked) => {
    setFormData(prev => ({ ...prev, formCompleted: checked }));
  }, []);

  // Get display values
  const getLocationDisplay = useCallback(() => {
    if (formData.locationType === 'SDO') {
      return `SDO - Imus City - ${formData.department}`;
    } else if (formData.locationType === 'SCHOOL') {
      return `${formData.schoolLevel} - ${formData.schoolName}`;
    }
    return '';
  }, [formData]);

  const getActionTypeDisplay = useCallback(() => {
    return formData.actionType === 'CREATE' ? 'Create Account' : 'Reset Password';
  }, [formData.actionType]);

  // Form validation
  const validateForm = useCallback(() => {
    if (!validateEmail(formData.email)) {
      addNotification('error', 'Please enter a valid email address', 6000);
      return false;
    }

    if (!formData.captchaCode) {
      addNotification('warning', 'Please enter the verification code', 6000);
      return false;
    }

    // Check form completion only for DEPED ACCOUNT and M365
    const accountName = accountTypes.find(type => type.id === formData.accountType)?.name;
    const requiresFormCompletion = formData.actionType === 'CREATE' && 
                                 (accountName === 'DEPED ACCOUNT' || accountName?.includes('M365'));

    if (requiresFormCompletion && !formData.formCompleted) {
      let formType = accountName === 'DEPED ACCOUNT' ? 'DEPED ACCOUNT' : 'M365 Account Creation';
      
      addNotification('warning', 
        `Please complete the following steps before submitting:\n\n` +
        `1. Click the "${formType} Form" link above\n` +
        `2. Fill out all required information in the Excel form\n` +
        `3. Check the confirmation checkbox below the form link`, 
        8000
      );
      return false;
    }

    return true;
  }, [formData, accountTypes, validateEmail, addNotification]);

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
    setIsSubmitting(true);
    setShowConfirmation(false);

    try {
      const response = await api.post('/tickets/account-management', {
        category: 'ACCOUNT_MANAGEMENT',
        email: formData.email,
        priority: formData.priority,
        accountType: formData.accountType,
        actionType: formData.actionType,
        locationType: formData.locationType,
        location: formData.locationType === 'SDO' ? formData.department : formData.schoolName,
        schoolLevel: formData.locationType === 'SCHOOL' ? formData.schoolLevel : null,
        schoolName: formData.locationType === 'SCHOOL' ? formData.schoolName : null,
        department: formData.locationType === 'SDO' ? formData.department : null,
        subject: formData.subject,
        message: formData.message,
        categorySpecificDetails: {
          type: 'Account Management',
          details: {
            accountType: accountTypes.find(type => type.id === formData.accountType)?.name,
            actionType: formData.actionType,
            locationType: formData.locationType,
            location: formData.locationType === 'SDO' ? formData.department : formData.schoolName,
            department: formData.locationType === 'SDO' ? formData.department : null,
            schoolLevel: formData.locationType === 'SCHOOL' ? formData.schoolLevel : null,
            schoolName: formData.locationType === 'SCHOOL' ? formData.schoolName : null,
            subject: formData.subject,
            message: formData.message
          }
        },
        captchaId: captcha.id,
        captchaCode: formData.captchaCode
      });

      // Success notification
      addNotification('success', 
        `Account management request submitted successfully!\nTicket #${response.data.ticketId}\nTracking ID: ${response.data.trackingId}`, 
        10000
      );

      // Reset form
      setFormData(INITIAL_FORM_DATA);
      generateCaptcha();
    } catch (error) {
      console.error('Error submitting request:', error);
      const errorMessage = error.response?.data?.message || 'Unable to submit request';
      
      if (error.response?.status === 429) {
        // Rate limit error
        const rateLimitInfo = error.response.data.rateLimitInfo;
        addNotification('error', 
          `Rate limit exceeded. Please wait ${rateLimitInfo.cooldownMinutes} minutes. ` +
          `Remaining attempts: ${rateLimitInfo.remainingAttempts}`, 
          15000
        );
      } else if (error.response?.status === 400 && error.response.data?.captchaError) {
        // CAPTCHA validation error
        addNotification('warning', 
          `Invalid CAPTCHA code. Please try again. ${error.response.data.remainingAttempts} attempts remaining.`, 
          8000
        );
        generateCaptcha();
      } else {
        // General error
        addNotification('error', `Error: ${errorMessage}`, 10000);
        generateCaptcha();
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, accountTypes, captcha, addNotification, generateCaptcha]);

  return {
    formData,
    isSubmitting,
    emailError,
    showConfirmation,
    setShowConfirmation,
    handleChange,
    handleCheckboxChange,
    handleSubmit,
    handleConfirmSubmit,
    getLocationDisplay,
    getActionTypeDisplay,
    validateEmail
  };
}; 