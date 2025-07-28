import { useState, useEffect, useCallback } from 'react';
import api from '../../../utils/api';

export const useCaptcha = (addNotification) => {
  const [captcha, setCaptcha] = useState({ id: '', code: '' });
  const [captchaError, setCaptchaError] = useState(null);
  const [captchaDisabled, setCaptchaDisabled] = useState(false);

  // Generate CAPTCHA
  const generateCaptcha = useCallback(async (retryCount = 0) => {
    try {
      setCaptchaError(null);
      const response = await api.get('/tickets/generate-captcha');
      setCaptcha({
        id: response.data.captchaId,
        code: response.data.captchaCode
      });
      setCaptchaDisabled(false);
    } catch (error) {
      console.error('Error generating CAPTCHA:', error);
      const errorMessage = error.response?.data?.message || 'Unable to generate verification code';
      setCaptchaError(errorMessage);
      addNotification('error', `CAPTCHA Error: ${errorMessage}`, 8000);
      
      if (retryCount < 2) {
        setTimeout(() => generateCaptcha(retryCount + 1), 2000);
      } else {
        addNotification('warning', 'Multiple failed attempts to generate CAPTCHA. Please try again later.', 10000);
      }
    }
  }, [addNotification]);

  // Initialize CAPTCHA on component mount
  useEffect(() => {
    let mounted = true;
    let timeoutId = null;
    
    const initCaptcha = async () => {
      if (mounted && !captcha.id) {
        try {
          await generateCaptcha();
        } catch (error) {
          console.error('Failed to initialize CAPTCHA:', error);
        }
      }
    };

    timeoutId = setTimeout(initCaptcha, 1000);

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [generateCaptcha, captcha.id]);

  // Handle CAPTCHA refresh
  const handleRefreshCaptcha = useCallback(async () => {
    if (captchaDisabled) {
      return;
    }
    await generateCaptcha();
  }, [captchaDisabled, generateCaptcha]);

  return {
    captcha,
    captchaError,
    captchaDisabled,
    setCaptchaError,
    generateCaptcha,
    handleRefreshCaptcha
  };
}; 