import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Settings = () => {
  // Email settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    senderName: 'IT Support',
    senderEmail: '',
    enableNotifications: true,
  });

  // Password change state
  const [passwordSettings, setPasswordSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showPassword: false,
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [testingEmail, setTestingEmail] = useState(false);
  const [emailTestResult, setEmailTestResult] = useState(null);

  // Load settings from backend
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_BASE_URL}/admin/settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.data.success) {
        // Set the settings from the backend response
        setEmailSettings(response.data.data.email);
        setError(null);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveEmailSettings = async () => {
    try {
      // Validate email settings if notifications are enabled
      if (emailSettings.enableNotifications) {
        const requiredFields = ['smtpHost', 'smtpPort', 'smtpUser', 'smtpPassword', 'senderEmail'];
        const missingFields = requiredFields.filter(field => !emailSettings[field]);
        
        if (missingFields.length > 0) {
          setError(`Missing required email fields: ${missingFields.join(', ')}`);
          return;
        }
        
        if (emailSettings.smtpHost.includes('gmail') && !emailSettings.smtpUser.includes('@')) {
          setError('Gmail username must be a complete email address');
          return;
        }
      }

      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(`${API_BASE_URL}/admin/settings/email`, { email: emailSettings }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.data.success) {
        setSaveSuccess(true);
        setError(null);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Error saving email settings:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save email settings');
    } finally {
      setLoading(false);
    }
  };

  const testEmailSettings = async () => {
    try {
      // Validate required fields before sending
      const requiredFields = ['smtpHost', 'smtpPort', 'smtpUser', 'smtpPassword', 'senderEmail'];
      const missingFields = requiredFields.filter(field => !emailSettings[field]);
      
      if (missingFields.length > 0) {
        setEmailTestResult({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
        return;
      }
      
      // Gmail validation
      if (emailSettings.smtpHost.includes('gmail') && !emailSettings.smtpUser.includes('@')) {
        setEmailTestResult({
          success: false,
          message: 'Gmail username must be a complete email address'
        });
        return;
      }
      
      setTestingEmail(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(`${API_BASE_URL}/admin/settings/test-email`, emailSettings, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.data.success) {
        setEmailTestResult({
          success: true,
          message: 'Test email sent successfully!'
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Error testing email settings:', err);
      setEmailTestResult({
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to send test email'
      });
    } finally {
      setTestingEmail(false);
    }
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailSwitchChange = (e) => {
    const { name, checked } = e.target;
    setEmailSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSnackbarClose = () => {
    setSaveSuccess(false);
    setEmailTestResult(null);
  };

  const handlePasswordChange = async () => {
    try {
      if (passwordSettings.newPassword !== passwordSettings.confirmPassword) {
        setError('New passwords do not match');
        return;
      }

      // Enhanced password validation
      const hasUpperCase = /[A-Z]/.test(passwordSettings.newPassword);
      const hasLowerCase = /[a-z]/.test(passwordSettings.newPassword);
      const hasNumbers = /\d/.test(passwordSettings.newPassword);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordSettings.newPassword);
      const isLongEnough = passwordSettings.newPassword.length >= 8;

      if (!isLongEnough) {
        setError('Password must be at least 8 characters long');
        return;
      }
      if (!hasUpperCase) {
        setError('Password must contain at least one uppercase letter');
        return;
      }
      if (!hasLowerCase) {
        setError('Password must contain at least one lowercase letter');
        return;
      }
      if (!hasNumbers) {
        setError('Password must contain at least one number');
        return;
      }
      if (!hasSpecialChar) {
        setError('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)');
        return;
      }

      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(`${API_BASE_URL}/admin/change-password`, {
        currentPassword: passwordSettings.currentPassword,
        newPassword: passwordSettings.newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.data.success) {
        setSaveSuccess(true);
        setError(null);
        setPasswordSettings({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          showPassword: false,
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.response?.data?.message || err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !emailSettings) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Poppins' }}>System Settings</Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3, '& .MuiAlert-message': { fontFamily: 'Poppins' } }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Admin Utilities */}
        <Grid item xs={12}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="admin-utilities-content"
              id="admin-utilities-header"
              sx={{ '& .MuiAccordionSummary-content': { fontFamily: 'Poppins' } }}
            >
              <Typography variant="h6" sx={{ fontFamily: 'Poppins' }}>Admin Utilities</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                {/* Password Change */}
                <Grid item xs={12}>
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Poppins' }}>Change Password</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            required
                            label="Current Password"
                            type={passwordSettings.showPassword ? 'text' : 'password'}
                            value={passwordSettings.currentPassword}
                            onChange={(e) => setPasswordSettings(prev => ({ ...prev, currentPassword: e.target.value }))}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockIcon />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => setPasswordSettings(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                                    edge="end"
                                  >
                                    {passwordSettings.showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiInputLabel-root': { fontFamily: 'Poppins' },
                              '& .MuiInputBase-input': { fontFamily: 'Poppins' }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            required
                            label="New Password"
                            type={passwordSettings.showPassword ? 'text' : 'password'}
                            value={passwordSettings.newPassword}
                            onChange={(e) => setPasswordSettings(prev => ({ ...prev, newPassword: e.target.value }))}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockIcon />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiInputLabel-root': { fontFamily: 'Poppins' },
                              '& .MuiInputBase-input': { fontFamily: 'Poppins' }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            required
                            label="Confirm New Password"
                            type={passwordSettings.showPassword ? 'text' : 'password'}
                            value={passwordSettings.confirmPassword}
                            onChange={(e) => setPasswordSettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockIcon />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiInputLabel-root': { fontFamily: 'Poppins' },
                              '& .MuiInputBase-input': { fontFamily: 'Poppins' }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handlePasswordChange}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                            sx={{ fontFamily: 'Poppins' }}
                          >
                            {loading ? 'Changing Password...' : 'Change Password'}
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        
        {/* Email Settings */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="email-settings-content"
              id="email-settings-header"
              sx={{ '& .MuiAccordionSummary-content': { fontFamily: 'Poppins' } }}
            >
              <Typography variant="h6" sx={{ fontFamily: 'Poppins' }}>Changer Email Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={emailSettings.enableNotifications}
                        onChange={handleEmailSwitchChange}
                        name="enableNotifications"
                        color="primary"
                      />
                    }
                    label="Enable Changer Email Notifications"
                    sx={{ '& .MuiFormControlLabel-label': { fontFamily: 'Poppins' } }}
                  />
                </Grid>
                
                {emailSettings.enableNotifications && (
                  <>
                    <Grid item xs={12}>
                      <Alert severity="info" sx={{ mb: 2, '& .MuiAlert-message': { fontFamily: 'Poppins' } }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontFamily: 'Poppins' }}>Email Configuration Requirements:</Typography>
                        <Typography component="div" sx={{ fontFamily: 'Poppins' }}>
                          <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                            <li>For Gmail accounts with 2-Factor Authentication (2FA):</li>
                            <Box component="ul" sx={{ pl: 2 }}>
                              <li>You MUST use an App Password (16 characters, no spaces)</li>
                              <li>Steps to get an App Password:</li>
                              <Box component="ol" sx={{ pl: 2 }}>
                                <li>Go to <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer">Google Account Security</a></li>
                                <li>Enable 2-Step Verification if not already enabled</li>
                                <li>Go to <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer">App Passwords</a></li>
                                <li>Select "Mail" and your device</li>
                                <li>Copy the generated 16-character password</li>
                                <li>Remove any spaces from the password</li>
                              </Box>
                            </Box>
                            <li>For Gmail accounts without 2FA:</li>
                            <Box component="ul" sx={{ pl: 2 }}>
                              <li>Enable "Less secure app access" in your <a href="https://myaccount.google.com/lesssecureapps" target="_blank" rel="noreferrer">Google Account Settings</a></li>
                              <li>Use your regular Gmail password</li>
                              <li>Note: This is not recommended for security reasons</li>
                            </Box>
                            <li>Default Gmail Settings:</li>
                            <Box component="ul" sx={{ pl: 2 }}>
                              <li>SMTP Host: smtp.gmail.com</li>
                              <li>SMTP Port: 587 (TLS) or 465 (SSL)</li>
                              <li>Username: Your full Gmail address</li>
                            </Box>
                          </Box>
                        </Typography>
                      </Alert>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="SMTP Host"
                        name="smtpHost"
                        value={emailSettings.smtpHost}
                        onChange={handleEmailChange}
                        margin="normal"
                        helperText={emailSettings.smtpHost.includes('gmail') ? "Using Gmail SMTP server" : ""}
                        error={!emailSettings.smtpHost}
                        sx={{
                          '& .MuiInputLabel-root': { fontFamily: 'Poppins' },
                          '& .MuiInputBase-input': { fontFamily: 'Poppins' },
                          '& .MuiFormHelperText-root': { fontFamily: 'Poppins' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="SMTP Port"
                        name="smtpPort"
                        type="number"
                        value={emailSettings.smtpPort}
                        onChange={handleEmailChange}
                        margin="normal"
                        helperText={emailSettings.smtpHost.includes('gmail') ? "For Gmail, use 587 (TLS) or 465 (SSL)" : ""}
                        error={!emailSettings.smtpPort || (emailSettings.smtpHost.includes('gmail') && ![587, 465].includes(Number(emailSettings.smtpPort)))}
                        sx={{
                          '& .MuiInputLabel-root': { fontFamily: 'Poppins' },
                          '& .MuiInputBase-input': { fontFamily: 'Poppins' },
                          '& .MuiFormHelperText-root': { fontFamily: 'Poppins' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="SMTP Username"
                        name="smtpUser"
                        value={emailSettings.smtpUser}
                        onChange={handleEmailChange}
                        margin="normal"
                        helperText={emailSettings.smtpHost.includes('gmail') ? "Must be your full Gmail email address" : ""}
                        error={!emailSettings.smtpUser || (emailSettings.smtpHost.includes('gmail') && !emailSettings.smtpUser.includes('@'))}
                        sx={{
                          '& .MuiInputLabel-root': { fontFamily: 'Poppins' },
                          '& .MuiInputBase-input': { fontFamily: 'Poppins' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="SMTP Password"
                        name="smtpPassword"
                        type="password"
                        value={emailSettings.smtpPassword}
                        onChange={handleEmailChange}
                        margin="normal"
                        helperText={
                          emailSettings.smtpHost.includes('gmail') 
                            ? emailSettings.smtpPassword
                              ? emailSettings.smtpPassword.length === 16 && !/\s/.test(emailSettings.smtpPassword)
                                ? "✓ Valid App Password format"
                                : emailSettings.smtpPassword.includes(' ')
                                ? "❌ Remove all spaces from the App Password"
                                : emailSettings.smtpPassword.length !== 16
                                ? `❌ App Password must be exactly 16 characters (current: ${emailSettings.smtpPassword.length})`
                                : "❌ Invalid App Password format"
                              : "Enter your App Password (16 characters, no spaces)"
                            : ""
                        }
                        error={
                          emailSettings.smtpHost.includes('gmail') && 
                          (
                            !emailSettings.smtpPassword || 
                            emailSettings.smtpPassword.length !== 16 ||
                            /\s/.test(emailSettings.smtpPassword)
                          )
                        }
                        sx={{
                          '& .MuiInputLabel-root': { fontFamily: 'Poppins' },
                          '& .MuiInputBase-input': { fontFamily: 'Poppins' }
                        }}
                      />
                      {emailSettings.smtpHost.includes('gmail') && emailSettings.smtpPassword && (
                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption" color="textSecondary" sx={{ fontFamily: 'Poppins' }}>
                            Password Format:
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Typography variant="caption" color={emailSettings.smtpPassword.length === 16 ? "success.main" : "error.main"}>
                              {emailSettings.smtpPassword.length === 16 ? "✓" : "❌"} 16 characters
                            </Typography>
                            <Typography variant="caption" color={!/\s/.test(emailSettings.smtpPassword) ? "success.main" : "error.main"}>
                              {!/\s/.test(emailSettings.smtpPassword) ? "✓" : "❌"} No spaces
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <Alert severity="warning" sx={{ mb: 2, '& .MuiAlert-message': { fontFamily: 'Poppins' } }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontFamily: 'Poppins' }}>Security Notice:</Typography>
                        <Typography component="div" sx={{ fontFamily: 'Poppins' }}>
                          For enhanced security, we strongly recommend:
                          <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                            <li>Enabling 2-Factor Authentication on your Gmail account</li>
                            <li>Using App Passwords instead of your main account password</li>
                            <li>Creating a dedicated Gmail account for system notifications</li>
                          </Box>
                        </Typography>
                      </Alert>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Sender Name"
                        name="senderName"
                        value={emailSettings.senderName}
                        onChange={handleEmailChange}
                        margin="normal"
                        sx={{
                          '& .MuiInputLabel-root': { fontFamily: 'Poppins' },
                          '& .MuiInputBase-input': { fontFamily: 'Poppins' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="Sender Email"
                        name="senderEmail"
                        type="email"
                        value={emailSettings.senderEmail}
                        onChange={handleEmailChange}
                        margin="normal"
                        error={!emailSettings.senderEmail || !emailSettings.senderEmail.includes('@')}
                        helperText={!emailSettings.senderEmail.includes('@') ? "Must be a valid email address" : ""}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiInputLabel-root': { fontFamily: 'Poppins' },
                          '& .MuiInputBase-input': { fontFamily: 'Poppins' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={testEmailSettings}
                        disabled={testingEmail}
                        sx={{
                          position: 'relative',
                          minWidth: '180px',
                          height: '42px',
                          fontFamily: 'Poppins'
                        }}
                      >
                        {testingEmail ? (
                          <>
                            <CircularProgress 
                              size={24} 
                              sx={{
                                color: 'primary.main',
                                mr: 1
                              }}
                            />
                            Sending Email...
                          </>
                        ) : (
                          <>
                            <EmailIcon sx={{ mr: 1 }} />
                            Send Test Email
                          </>
                        )}
                      </Button>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1, fontFamily: 'Poppins' }}>
                        All fields marked with * are required before you can send a test email.
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </AccordionDetails>
            <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={saveEmailSettings}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                sx={{ fontFamily: 'Poppins' }}
              >
                {loading ? 'Saving...' : 'Save Email Settings'}
              </Button>
            </Box>
          </Accordion>
        </Grid>
      </Grid>
      
      {/* Success Message */}
      <Snackbar
        open={saveSuccess}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" variant="filled" sx={{ '& .MuiAlert-message': { fontFamily: 'Poppins' } }}>
          Settings saved successfully!
        </Alert>
      </Snackbar>
      
      {/* Email Test Results */}
      <Snackbar
        open={emailTestResult !== null}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={emailTestResult?.success ? "success" : "error"}
          variant="filled"
          sx={{ '& .MuiAlert-message': { fontFamily: 'Poppins' } }}
        >
          {emailTestResult?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings; 