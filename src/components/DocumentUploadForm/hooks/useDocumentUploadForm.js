import { useState, useCallback } from 'react';
import { INITIAL_FORM_DATA, EMAIL_REGEX, FILE_CONSTRAINTS } from '../constants';
import api from '../../../utils/api';

export const useDocumentUploadForm = (documentTypes, addNotification, generateCaptcha, captcha) => {
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
      ...(name === 'locationType' && { schoolLevel: '', schoolName: '', department: '' }),
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

  // Handle file upload
  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size
      if (file.size > FILE_CONSTRAINTS.MAX_SIZE) {
        addNotification('error', 'File size exceeds the 2MB limit. Please choose a smaller file.', 8000);
        event.target.value = ''; // Reset file input
        return;
      }

      // Check file type
      if (!FILE_CONSTRAINTS.ALLOWED_TYPES.includes(file.type)) {
        addNotification('error', `Invalid file type. Only ${FILE_CONSTRAINTS.ALLOWED_EXTENSIONS.join(', ')} files are allowed.`, 8000);
        event.target.value = ''; // Reset file input
        return;
      }

      setFormData(prev => ({
        ...prev,
        file: file
      }));
      addNotification('success', `File "${file.name}" selected successfully.`, 4000);
    }
  }, [addNotification]);

  // Get display values
  const getLocationDisplay = useCallback(() => {
    if (formData.locationType === 'SDO') {
      return `SDO - Imus City - ${formData.department}`;
    } else if (formData.locationType === 'SCHOOL') {
      return `${formData.schoolLevel} - ${formData.schoolName}`;
    }
    return '';
  }, [formData]);

  const getDocumentTypeDisplay = useCallback(() => {
    const selectedType = documentTypes.find(type => type.id === formData.documentType);
    return selectedType ? selectedType.name : '';
  }, [documentTypes, formData.documentType]);

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

    // Validate required fields including document type
    if (!formData.name || !formData.email || !formData.locationType || !formData.subject || !formData.message || !formData.documentType) {
      addNotification('error', 'Please fill in all required fields', 6000);
      return false;
    }

    // Validate school selection if school location is selected
    if (formData.locationType === 'SCHOOL' && !formData.schoolName) {
      addNotification('error', 'Please select a school', 6000);
      return false;
    }

    // Validate department selection if SDO location is selected
    if (formData.locationType === 'SDO' && !formData.department) {
      addNotification('error', 'Please select a department', 6000);
      return false;
    }

    return true;
  }, [formData, validateEmail, addNotification]);

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
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('priority', formData.priority || 'MEDIUM');
      formDataToSend.append('category', 'DOCUMENT_UPLOAD');
      formDataToSend.append('status', 'PENDING');
      formDataToSend.append('documentType', formData.documentType);
      formDataToSend.append('documentSubject', formData.subject);
      formDataToSend.append('documentMessage', formData.message);
      formDataToSend.append('locationType', formData.locationType);
      formDataToSend.append('location', formData.locationType === 'SDO' ? 'SDO_IMUS_CITY' : 'SCHOOL_IMUS_CITY');
      formDataToSend.append('department', formData.locationType === 'SDO' ? formData.department : null);
      formDataToSend.append('schoolLevel', formData.locationType === 'SCHOOL' ? formData.schoolLevel : null);
      formDataToSend.append('schoolName', formData.locationType === 'SCHOOL' ? formData.schoolName : null);
      
      // Structure the category specific details
      const categorySpecificDetails = {
        type: 'Document Processing',
        details: {
          documentType: formData.documentType,
          subject: formData.subject,
          message: formData.message,
          locationType: formData.locationType,
          location: formData.locationType === 'SDO' ? 'SDO_IMUS_CITY' : 'SCHOOL_IMUS_CITY',
          department: formData.locationType === 'SDO' ? formData.department : null,
          schoolLevel: formData.locationType === 'SCHOOL' ? formData.schoolLevel : null,
          schoolName: formData.locationType === 'SCHOOL' ? formData.schoolName : null
        }
      };
      formDataToSend.append('categorySpecificDetails', JSON.stringify(categorySpecificDetails));
      
      formDataToSend.append('captchaId', captcha.id);
      formDataToSend.append('captchaCode', formData.captchaCode);
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }

      const response = await api.post('/tickets/document-upload', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Success notification
      addNotification('success', 
        `Document upload request submitted successfully!\nTicket #${response.data.ticketId}\nTracking ID: ${response.data.trackingId}`, 
        10000
      );

      // Reset form
      setFormData(INITIAL_FORM_DATA);
      
      // Reset file input
      const fileInput = document.getElementById('file-upload');
      if (fileInput) {
        fileInput.value = '';
      }

      generateCaptcha();
    } catch (error) {
      console.error('Error submitting request:', error);
      
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
        const errorMessage = error.response?.data?.message || 'Unable to submit request';
        addNotification('error', `Error: ${errorMessage}`, 10000);
        generateCaptcha();
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, captcha, addNotification, generateCaptcha]);

  return {
    formData,
    isSubmitting,
    emailError,
    showConfirmation,
    setShowConfirmation,
    handleChange,
    handleFileChange,
    handleSubmit,
    handleConfirmSubmit,
    getLocationDisplay,
    getDocumentTypeDisplay,
    validateEmail
  };
}; 