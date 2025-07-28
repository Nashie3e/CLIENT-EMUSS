import React from 'react';
import { 
  Grid,
  Box, 
  Typography, 
  Button, 
  TextField,
  CircularProgress 
} from '@mui/material';
import { captchaStyles, buttonStyles, commonStyles } from '../styles';

const CaptchaSection = ({ 
  captchaCode,
  userCaptcha,
  setUserCaptcha,
  loadingCaptcha,
  loading,
  generateNewCaptcha
}) => {
  return (
    <Grid item xs={12}>
      <Box sx={captchaStyles.container}>
        <Typography variant="h5" sx={{ 
          color: '#000000',
          fontWeight: 600,
          mb: 3,
          ...commonStyles.poppinsText,
          fontSize: '1.5rem'
        }}>
          Spam Prevention
        </Typography>
        
        <Typography variant="subtitle1" sx={{ 
          color: '#666666', 
          mb: 3,
          fontSize: '0.95rem'
        }}>
          Please enter the verification code below:
        </Typography>
        
        <Box sx={captchaStyles.codeBox}>
          {loadingCaptcha ? (
            <CircularProgress size={24} sx={{ mb: 2 }} />
          ) : (
            <Typography variant="h4" sx={captchaStyles.codeDisplay}>
              {captchaCode}
            </Typography>
          )}
          
          <Button
            variant="outlined"
            size="small"
            onClick={generateNewCaptcha}
            disabled={loadingCaptcha || loading}
            sx={buttonStyles.captchaRefresh}
          >
            Refresh Code
          </Button>
          
          <TextField
            fullWidth
            label="Enter Verification Code"
            variant="outlined"
            value={userCaptcha}
            onChange={(e) => setUserCaptcha(e.target.value)}
            required
            disabled={loading}
            sx={captchaStyles.codeInput}
          />
        </Box>
      </Box>
    </Grid>
  );
};

export default CaptchaSection; 