import { useState, useEffect, useCallback } from 'react';
import api from '../../../utils/api';

export const useCaptcha = (addNotification) => {
  const [captcha, setCaptcha] = useState({ id: '', code: '' });
  const [captchaError, setCaptchaError] = useState(null);
  const [captchaDisabled, setCaptchaDisabled] = useState(false);

  // Generate CAPTCHA
  const generateCaptcha = useCallback(async (retryCount = 0) => {
    if (captchaDisabled) {
      return;
    }

    try {
      setCaptchaError(null);
      setCaptchaDisabled(true); // Disable temporarily while generating
      
      const response = await api.get('/tickets/generate-captcha');
      setCaptcha({
        id: response.data.captchaId,
        code: response.data.captchaCode
      });
      
      setCaptchaDisabled(false);
    } catch (error) {
      console.error('Error generating CAPTCHA:', error);
      
      if (error.response?.status === 429) {
        // Rate limit error
        const cooldownMinutes = error.response.data.rateLimitInfo?.cooldownMinutes || 1;
        
        const errorMessage = `Too many requests. Please wait ${cooldownMinutes} minute${cooldownMinutes > 1 ? 's' : ''}.`;
        setCaptchaError(errorMessage);
        addNotification('error', errorMessage, 8000);
        
        // Keep CAPTCHA disabled for the cooldown period
        setCaptchaDisabled(true);
        setTimeout(() => {
          setCaptchaDisabled(false);
        }, cooldownMinutes * 60 * 1000);
        
        return;
      }

      const errorMessage = error.response?.data?.message || 'Unable to generate verification code';
      setCaptchaError(errorMessage);
      addNotification('error', `CAPTCHA Error: ${errorMessage}`, 8000);
      
      // Only retry for non-rate-limit errors
      if (retryCount < 2) {
        setCaptchaDisabled(true);
        setTimeout(() => {
          setCaptchaDisabled(false);
          generateCaptcha(retryCount + 1);
        }, 2000);
      } else {
        addNotification('warning', 'Failed to generate CAPTCHA. Please try again later.', 10000);
        setCaptchaDisabled(true);
        setTimeout(() => {
          setCaptchaDisabled(false);
        }, 5000);
      }
    }
  }, [addNotification, captchaDisabled]);

  // Initialize CAPTCHA
  useEffect(() => {
    let mounted = true;
    let timeoutId = null;
    
    const initCaptcha = async () => {
      if (mounted && !captcha.id && !captchaDisabled) {
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
  }, [generateCaptcha, captcha.id, captchaDisabled]);

  // Handle CAPTCHA refresh
  const handleRefreshCaptcha = useCallback(async () => {
    if (captchaDisabled) {
      addNotification('warning', 'Please wait before requesting a new CAPTCHA code.', 6000);
      return;
    }
    await generateCaptcha();
  }, [captchaDisabled, generateCaptcha, addNotification]);

  return {
    captcha,
    captchaError,
    captchaDisabled,
    setCaptchaError,
    generateCaptcha,
    handleRefreshCaptcha
  };
}; 