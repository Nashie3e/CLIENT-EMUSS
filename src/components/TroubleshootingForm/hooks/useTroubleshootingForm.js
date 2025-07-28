import { useState, useCallback } from 'react';
import { INITIAL_FORM_DATA, EMAIL_REGEX, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../constants';

export const useTroubleshootingForm = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [emailError, setEmailError] = useState('');

  // Email validation function
  const validateEmail = useCallback((email) => {
    return EMAIL_REGEX.test(email);
  }, []);

  // Handle form field changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset dependent fields
      ...(name === 'typeOfEquipment' && { modelOfEquipment: '' }),
      ...(name === 'locationType' && { schoolLevel: '', schoolName: '' }),
      ...(name === 'schoolLevel' && { schoolName: '' })
    }));

    // Validate email when it changes
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

  // Handle file change
  const handleFileChange = useCallback((event, addNotification) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        addNotification('error', 'Invalid file type. Please upload a JPG, PNG, or PDF file.', 6000);
        return;
      }
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        addNotification('error', 'File size exceeds 5MB limit. Please choose a smaller file.', 6000);
        return;
      }

      setFormData(prev => ({
        ...prev,
        file: file
      }));
      addNotification('success', 'File attached successfully!', 3000);
    }
  }, []);

  // Reset form data
  const resetForm = useCallback(() => {
    setFormData({
      ...INITIAL_FORM_DATA,
      dateOfRequest: new Date().toISOString().split('T')[0],
      priority: 'MEDIUM'
    });
    setEmailError('');
  }, []);

  // Get location display string
  const getLocationDisplay = useCallback(() => {
    if (formData.locationType === 'SDO') {
      return 'SDO - Imus City';
    } else if (formData.locationType === 'SCHOOL') {
      return `${formData.schoolName} (${formData.schoolLevel})`;
    }
    return '';
  }, [formData.locationType, formData.schoolName, formData.schoolLevel]);

  // Get equipment display string
  const getEquipmentDisplay = useCallback(() => {
    if (formData.typeOfEquipment === 'Others') {
      return `${formData.customEquipmentType} - ${formData.modelOfEquipment}`;
    } else if (formData.modelOfEquipment === 'Other') {
      return `${formData.typeOfEquipment} - ${formData.customModel}`;
    }
    return `${formData.typeOfEquipment} - ${formData.modelOfEquipment}`;
  }, [formData.typeOfEquipment, formData.customEquipmentType, formData.modelOfEquipment, formData.customModel]);

  // Format date for display
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  return {
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
  };
}; 