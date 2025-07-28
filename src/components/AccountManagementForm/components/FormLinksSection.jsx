import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Checkbox
} from '@mui/material';
import { 
  Description as FileIcon, 
  Launch as LaunchIcon 
} from '@mui/icons-material';
import { FORM_LINKS } from '../constants';
import { buttonStyles, commonStyles } from '../styles';

const FormLinksSection = ({ 
  formData, 
  accountTypes,
  handleCheckboxChange 
}) => {
  const accountName = accountTypes.find(type => type.id === formData.accountType)?.name;
  const shouldShowFormLinks = (
    (formData.accountType && formData.actionType === 'CREATE' && accountName === 'DEPED ACCOUNT') || 
    (formData.accountType && formData.actionType === 'CREATE' && accountName?.includes('M365')) || 
    (formData.actionType === 'RESET' && 
     (accountName === 'DEPED ACCOUNT' || accountName?.includes('M365')))
  );

  if (!shouldShowFormLinks) return null;

  const getFormLink = () => {
    if (accountName === 'DEPED ACCOUNT') {
      return FORM_LINKS.DEPED_ACCOUNT[formData.actionType];
    } else if (accountName?.includes('M365')) {
      return FORM_LINKS.M365[formData.actionType];
    }
    return '';
  };

  const getFormTitle = () => {
    const action = formData.actionType === 'CREATE' ? 'Creation' : 'Reset';
    const type = accountName === 'DEPED ACCOUNT' ? 'DEPED ACCOUNT' : 'M365';
    return `${type} ${action} Form`;
  };

  return (
    <Box sx={{ 
      gridColumn: '1 / -1',
      mt: 2,
      p: { xs: 2, sm: 3 },
      backgroundColor: '#f8f8f8',
      borderRadius: { xs: '8px', sm: '12px' },
      border: '1px solid rgba(0, 0, 0, 0.1)'
    }}>
      <Typography variant="h6" sx={{ 
        ...commonStyles.sectionTitle,
        mb: { xs: 1.5, sm: 2 },
        fontSize: { xs: '1rem', sm: '1.2rem' }
      }}>
        Required Form Links
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
        <Button
          component="a"
          href={getFormLink()}
          target="_blank"
          rel="noopener noreferrer"
          variant="outlined"
          startIcon={<FileIcon />}
          endIcon={<LaunchIcon />}
          sx={buttonStyles.formLink}
        >
          {getFormTitle()}
        </Button>
        
        <Box sx={{ 
          mt: 2, 
          pt: 2, 
          borderTop: '1px dashed rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5
        }}>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 600,
            color: '#333',
            ...commonStyles.poppinsText
          }}>
            Please complete the following steps before submitting:
          </Typography>
          
          <Box component="ol" sx={{ 
            pl: 2.5, 
            m: 0,
            '& li': {
              mb: 0.5,
              color: '#555',
              fontSize: '0.9rem',
              ...commonStyles.poppinsText
            }
          }}>
            <li>Click the "{getFormTitle()}" link above</li>
            <li>Fill out all required information in the Excel form</li>
            <li>Check the confirmation checkbox below</li>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            mt: 1,
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
            p: 1.5,
            borderRadius: '8px',
            border: '1px solid rgba(25, 118, 210, 0.1)'
          }}>
            <Checkbox
              checked={formData.formCompleted}
              onChange={(e) => handleCheckboxChange(e.target.checked)}
              id="form-completed-checkbox"
              sx={{
                color: '#1976d2',
                '&.Mui-checked': {
                  color: '#1976d2',
                },
              }}
            />
            <Typography 
              component="label" 
              htmlFor="form-completed-checkbox" 
              variant="body2" 
              sx={{ 
                fontWeight: 500,
                cursor: 'pointer',
                fontSize: '0.9rem',
                ...commonStyles.poppinsText
              }}
            >
              I confirm that I have completed the required form
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FormLinksSection; 