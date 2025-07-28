import React from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert 
} from '@mui/material';
import { commonStyles, captchaStyles } from '../styles';

const CaptchaSection = ({ 
  formData, 
  setFormData, 
  captcha, 
  captchaError, 
  captchaDisabled, 
  handleRefreshCaptcha, 
  isSubmitting 
}) => {
  return (
    <Box sx={captchaStyles.container}>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          color: '#000000',
          fontWeight: 600,
          mb: 3,
          fontSize: '1.5rem',
          ...commonStyles.poppinsText
        }}
      >
        Spam Prevention
      </Typography>
      <Typography variant="subtitle1" gutterBottom sx={{ 
        color: '#666666', 
        mb: 3,
        fontSize: '0.95rem',
        ...commonStyles.poppinsText
      }}>
        Please enter the verification code below:
      </Typography>
      {captchaError && (
        <Alert severity="error" sx={{ 
          mb: 3, 
          maxWidth: '400px', 
          margin: '0 auto',
          borderRadius: 2
        }}>
          {captchaError}
        </Alert>
      )}
      <Box sx={{ 
        maxWidth: '400px', 
        margin: '0 auto',
        p: { xs: 2, sm: 3 },
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            ...captchaStyles.codeDisplay
          }}
        >
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
          onChange={(e) => setFormData({ ...formData, captchaCode: e.target.value })}
          required
          error={!!captchaError}
          helperText={captchaError}
          disabled={isSubmitting}
          sx={captchaStyles.input}
        />
      </Box>
    </Box>
  );
};

export default CaptchaSection; 