import React from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { commonStyles } from '../styles';

const CaptchaSection = ({ 
  formData,
  captcha,
  captchaError,
  captchaDisabled,
  isSubmitting,
  handleChange,
  handleRefreshCaptcha
}) => {
  return (
    <Box sx={commonStyles.captchaContainer}>
      <Typography variant="h5" sx={{ 
        color: '#000000',
        fontWeight: 600,
        mb: { xs: 2, sm: 3 },
        fontFamily: 'Poppins',
        fontSize: { xs: '1.2rem', sm: '1.5rem' }
      }}>
        Spam Prevention
      </Typography>
      
      <Box sx={{ 
        maxWidth: { xs: '100%', sm: '400px' }, 
        margin: '0 auto',
        p: { xs: 2, sm: 3 },
        backgroundColor: '#ffffff',
        borderRadius: { xs: '8px', sm: '12px' },
        border: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
      }}>
        <Typography variant="h4" sx={{ 
          fontFamily: 'monospace',
          letterSpacing: { xs: '0.3em', sm: '0.5em' },
          padding: { xs: '15px', sm: '20px' },
          borderRadius: '8px',
          userSelect: 'none',
          backgroundColor: '#f8f8f8',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          mb: 2,
          fontWeight: 600,
          fontSize: { xs: '1.2rem', sm: '1.5rem' }
        }}>
          {captcha.code}
        </Typography>
        
        <Button
          variant="outlined"
          size="small"
          onClick={handleRefreshCaptcha}
          disabled={captchaDisabled || isSubmitting}
          sx={{ 
            mb: 3,
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            width: { xs: '100%', sm: 'auto' },
            '&.Mui-disabled': {
              color: 'text.secondary'
            }
          }}
        >
          Refresh Code
        </Button>
        
        <TextField
          fullWidth
          label="Enter Verification Code"
          variant="outlined"
          value={formData.captchaCode}
          onChange={(e) => handleChange({ target: { name: 'captchaCode', value: e.target.value } })}
          required
          error={!!captchaError}
          helperText={captchaError}
          disabled={isSubmitting}
          sx={{ 
            '& .MuiInputBase-input': { 
              textAlign: 'center',
              fontSize: { xs: '1rem', sm: '1.2rem' },
              letterSpacing: '0.3em',
              fontFamily: 'monospace',
              fontWeight: 600,
              padding: { xs: '12px 10px', sm: '16px 14px' }
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default CaptchaSection; 