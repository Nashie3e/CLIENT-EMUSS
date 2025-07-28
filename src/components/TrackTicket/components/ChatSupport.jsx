import React from 'react';
import { Box, Paper, Typography, Button, IconButton } from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Help as HelpIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Phone as PhoneIcon,
  LiveHelp as LiveHelpIcon
} from '@mui/icons-material';
import { chatStyles } from '../styles';

const ChatSupport = ({ 
  isChatOpen, 
  chatStep, 
  handleChatToggle, 
  navigateToStep, 
  goBackToMain 
}) => {
  const renderChatContent = () => {
    switch (chatStep) {
      case 'howto':
        return (
          <Box>
            <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700, mb: 2, color: '#1e293b' }}>
              📘 How to Use the System
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontFamily: 'Poppins', fontWeight: 600, mb: 1, color: '#2563eb' }}>
                🔍 Tracking Your Ticket:
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'Poppins', mb: 2, lineHeight: 1.6, color: '#64748b' }}>
                1. Enter your Tracking ID (format: TK-XXXXXXXX)<br/>
                2. Enter the email address you used when submitting<br/>
                3. Click "Track Ticket" to view your ticket status
              </Typography>
              
              <Typography variant="subtitle1" sx={{ fontFamily: 'Poppins', fontWeight: 600, mb: 1, color: '#2563eb' }}>
                📝 Submitting a New Ticket:
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'Poppins', mb: 2, lineHeight: 1.6, color: '#64748b' }}>
                1. Go to the homepage<br/>
                2. Choose your ticket category<br/>
                3. Fill out the required information<br/>
                4. Submit and save your tracking ID
              </Typography>

              <Typography variant="subtitle1" sx={{ fontFamily: 'Poppins', fontWeight: 600, mb: 1, color: '#2563eb' }}>
                📧 Email Notifications:
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'Poppins', lineHeight: 1.6, color: '#64748b' }}>
                You'll receive email updates when your ticket status changes. Check your spam folder if you don't see them.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={goBackToMain}
              sx={{ fontFamily: 'Poppins', textTransform: 'none' }}
            >
              ← Back to Menu
            </Button>
          </Box>
        );
      
      case 'faq':
        return (
          <Box>
            <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700, mb: 2, color: '#1e293b' }}>
              ❓ Frequently Asked Questions
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontFamily: 'Poppins', fontWeight: 600, mb: 1, color: '#2563eb' }}>
                Q: I lost my tracking ID. What should I do?
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'Poppins', mb: 2, lineHeight: 1.6, color: '#64748b' }}>
                A: Check your email for the confirmation message sent when you submitted your ticket. The tracking ID is included there.
              </Typography>
              
              <Typography variant="subtitle1" sx={{ fontFamily: 'Poppins', fontWeight: 600, mb: 1, color: '#2563eb' }}>
                Q: How long does it take to process my ticket?
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'Poppins', mb: 2, lineHeight: 1.6, color: '#64748b' }}>
                A: Processing time varies by category and priority. High priority tickets are handled within 24-48 hours.
              </Typography>

              <Typography variant="subtitle1" sx={{ fontFamily: 'Poppins', fontWeight: 600, mb: 1, color: '#2563eb' }}>
                Q: Can I update my ticket after submission?
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'Poppins', mb: 2, lineHeight: 1.6, color: '#64748b' }}>
                A: Currently, you can't update tickets directly. Contact our support team if you need to provide additional information.
              </Typography>

              <Typography variant="subtitle1" sx={{ fontFamily: 'Poppins', fontWeight: 600, mb: 1, color: '#2563eb' }}>
                Q: What if my ticket shows "Pending" for too long?
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'Poppins', lineHeight: 1.6, color: '#64748b' }}>
                A: Tickets are processed in order of priority and submission time. If urgent, contact our support team directly.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={goBackToMain}
              sx={{ fontFamily: 'Poppins', textTransform: 'none' }}
            >
              ← Back to Menu
            </Button>
          </Box>
        );
      
      case 'contact':
        return (
          <Box>
            <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700, mb: 2, color: '#1e293b' }}>
              📞 Contact Support
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'rgba(37, 99, 235, 0.05)', 
                borderRadius: 2, 
                mb: 2,
                border: '1px solid rgba(37, 99, 235, 0.1)'
              }}>
                <Typography variant="subtitle1" sx={{ fontFamily: 'Poppins', fontWeight: 600, mb: 1, color: '#2563eb' }}>
                  📧 Email Support
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'Poppins', color: '#64748b' }}>
                  icts.imus@deped.gov.ph
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'Poppins', color: '#64748b', fontSize: '0.8rem' }}>
                  Response time: 24-48 hours
                </Typography>
              </Box>

              <Box sx={{ 
                p: 2, 
                bgcolor: 'rgba(34, 197, 94, 0.05)', 
                borderRadius: 2, 
                mb: 2,
                border: '1px solid rgba(34, 197, 94, 0.1)'
              }}>
                <Typography variant="subtitle1" sx={{ fontFamily: 'Poppins', fontWeight: 600, mb: 1, color: '#16a34a' }}>
                  🕒 Office Hours
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'Poppins', color: '#64748b' }}>
                  Monday - Friday: 8:00 AM - 5:00 PM<br/>
                  Saturday - Sunday: Closed
                </Typography>
              </Box>

              <Box sx={{ 
                p: 2, 
                bgcolor: 'rgba(245, 158, 11, 0.05)', 
                borderRadius: 2,
                border: '1px solid rgba(245, 158, 11, 0.1)'
              }}>
                <Typography variant="subtitle1" sx={{ fontFamily: 'Poppins', fontWeight: 600, mb: 1, color: '#d97706' }}>
                  📍 Office Location
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'Poppins', color: '#64748b' }}>
                  DepEd Imus City Division Office<br/>
                  ICT Unit, Imus City, Cavite
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              onClick={goBackToMain}
              sx={{ fontFamily: 'Poppins', textTransform: 'none' }}
            >
              ← Back to Menu
            </Button>
          </Box>
        );
      
      default:
        return (
          <Box>
            <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700, mb: 2, color: '#1e293b' }}>
              👋 How can we help you?
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'Poppins', mb: 3, color: '#64748b' }}>
              Choose an option below to get assistance with the ticketing system.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<HelpIcon />}
                onClick={() => navigateToStep('howto')}
                sx={{
                  fontFamily: 'Poppins',
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  p: 2,
                  borderColor: '#2563eb',
                  color: '#2563eb',
                  '&:hover': {
                    bgcolor: 'rgba(37, 99, 235, 0.05)',
                    borderColor: '#2563eb'
                  }
                }}
              >
                How to Use the System
              </Button>
              <Button
                variant="outlined"
                startIcon={<QuestionAnswerIcon />}
                onClick={() => navigateToStep('faq')}
                sx={{
                  fontFamily: 'Poppins',
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  p: 2,
                  borderColor: '#16a34a',
                  color: '#16a34a',
                  '&:hover': {
                    bgcolor: 'rgba(34, 197, 94, 0.05)',
                    borderColor: '#16a34a'
                  }
                }}
              >
                Frequently Asked Questions
              </Button>
              <Button
                variant="outlined"
                startIcon={<PhoneIcon />}
                onClick={() => navigateToStep('contact')}
                sx={{
                  fontFamily: 'Poppins',
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  p: 2,
                  borderColor: '#d97706',
                  color: '#d97706',
                  '&:hover': {
                    bgcolor: 'rgba(245, 158, 11, 0.05)',
                    borderColor: '#d97706'
                  }
                }}
              >
                Contact Support Team
              </Button>
            </Box>
          </Box>
        );
    }
  };

  return (
    <Box sx={chatStyles.container}>
      {/* Chat Widget */}
      {isChatOpen && (
        <Paper elevation={8} sx={chatStyles.widget}>
          {/* Chat Header */}
          <Box sx={chatStyles.header}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                }}
              >
                <LiveHelpIcon sx={{ color: '#ffffff', fontSize: '1.2rem' }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 700,
                    color: '#1e293b',
                    fontSize: '1rem'
                  }}
                >
                  🤖 Help Center
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'Poppins',
                    color: '#64748b',
                    fontSize: '0.75rem'
                  }}
                >
                  Online • Ready to help
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={handleChatToggle}
              sx={{
                color: '#64748b',
                '&:hover': {
                  bgcolor: 'rgba(37, 99, 235, 0.05)',
                  color: '#2563eb'
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Chat Content */}
          <Box sx={chatStyles.content}>
            {renderChatContent()}
          </Box>
        </Paper>
      )}

      {/* Chat Toggle Button */}
      <Box
        onClick={handleChatToggle}
        sx={{
          ...chatStyles.toggleButton,
          background: isChatOpen 
            ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
            : 'linear-gradient(135deg, #2563eb, #3b82f6)',
          boxShadow: isChatOpen 
            ? '0 8px 25px rgba(239, 68, 68, 0.4), 0 4px 12px rgba(239, 68, 68, 0.2)'
            : '0 8px 25px rgba(37, 99, 235, 0.4), 0 4px 12px rgba(37, 99, 235, 0.2)',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: isChatOpen 
              ? '0 12px 35px rgba(239, 68, 68, 0.5), 0 6px 16px rgba(239, 68, 68, 0.3)'
              : '0 12px 35px rgba(37, 99, 235, 0.5), 0 6px 16px rgba(37, 99, 235, 0.3)',
          },
        }}
      >
        {isChatOpen ? (
          <CloseIcon sx={{ color: '#ffffff', fontSize: '1.5rem' }} />
        ) : (
          <ChatIcon sx={{ color: '#ffffff', fontSize: '1.5rem' }} />
        )}
      </Box>

      {/* Floating tooltip when chat is closed */}
      {!isChatOpen && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 70,
            right: 70,
            bgcolor: '#1e293b',
            color: '#ffffff',
            px: 2,
            py: 1,
            borderRadius: 2,
            fontSize: '0.875rem',
            fontFamily: 'Poppins',
            fontWeight: 500,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            opacity: 0,
            animation: 'fadeInOut 4s ease-in-out infinite',
            '@keyframes fadeInOut': {
              '0%, 70%, 100%': { opacity: 0 },
              '10%, 60%': { opacity: 1 }
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -6,
              right: 20,
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #1e293b'
            }
          }}
        >
          Need help? 💬
        </Box>
      )}
    </Box>
  );
};

export default ChatSupport; 