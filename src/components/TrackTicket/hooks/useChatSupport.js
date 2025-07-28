import { useState, useCallback } from 'react';

export const useChatSupport = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatStep, setChatStep] = useState('main'); // 'main', 'howto', 'faq', 'contact'

  const handleChatToggle = useCallback(() => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setChatStep('main');
    }
  }, [isChatOpen]);

  const navigateToStep = useCallback((step) => {
    setChatStep(step);
  }, []);

  const goBackToMain = useCallback(() => {
    setChatStep('main');
  }, []);

  return {
    isChatOpen,
    chatStep,
    handleChatToggle,
    navigateToStep,
    goBackToMain
  };
}; 