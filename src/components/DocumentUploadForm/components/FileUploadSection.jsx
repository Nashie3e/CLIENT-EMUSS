import React from 'react';
import { Box, Typography, Button, FormControl } from '@mui/material';
import { AttachFile as AttachFileIcon } from '@mui/icons-material';
import { fileUploadStyles, buttonStyles, commonStyles } from '../styles';
import { FILE_CONSTRAINTS } from '../constants';

const FileUploadSection = ({ 
  formData, 
  handleFileChange 
}) => {
  return (
    <Box sx={fileUploadStyles.container}>
      <Typography variant="h6" sx={{ 
        ...commonStyles.sectionTitle,
        mb: { xs: 2, sm: 3 },
        fontSize: { xs: '1rem', sm: '1.2rem' },
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        width: '100%',
        justifyContent: 'center'
      }}>
        <AttachFileIcon /> Upload Document ({FILE_CONSTRAINTS.ALLOWED_EXTENSIONS.join(', ')})
      </Typography>
      
      <FormControl sx={fileUploadStyles.formControl}>
        <input
          accept={FILE_CONSTRAINTS.ALLOWED_TYPES.join(',')}
          style={{ display: 'none' }}
          id="file-upload"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload" style={{ width: '100%' }}>
          <Button
            variant="outlined"
            component="span"
            fullWidth
            sx={buttonStyles.upload}
          >
            Upload Document ({FILE_CONSTRAINTS.ALLOWED_EXTENSIONS.join(', ')})
          </Button>
        </label>
        {formData.file && (
          <Typography variant="body2" sx={fileUploadStyles.selectedFile}>
            Selected file: {formData.file.name}
          </Typography>
        )}
      </FormControl>
    </Box>
  );
};

export default FileUploadSection; 