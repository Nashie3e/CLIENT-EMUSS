import React from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  FormControl, 
  Button 
} from '@mui/material';
import { AttachFile as AttachFileIcon } from '@mui/icons-material';
import { commonStyles, buttonStyles } from '../styles';

const MessageAndAttachmentSection = ({ 
  formData, 
  handleChange, 
  handleFileChange, 
  addNotification, 
  isSubmitting 
}) => {
  return (
    <>
      {/* Message Details Section */}
      <Box sx={{ gridColumn: '1 / -1', mt: 2 }}>
        <Typography variant="h6" sx={commonStyles.sectionTitle}>
          Message Details (Optional)
        </Typography>
      </Box>

      <TextField
        multiline
        rows={4}
        label="Specific Problem"
        name="specificProblem"
        value={formData.specificProblem}
        onChange={handleChange}
        className="full-width"
        disabled={isSubmitting}
      />

      {/* Attachments Section */}
      <Box sx={{ 
        gridColumn: '1 / -1', 
        mt: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <Typography variant="h6" sx={{ 
          ...commonStyles.sectionTitle,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          width: '100%',
          justifyContent: 'center'
        }}>
          <AttachFileIcon /> Attachments (Optional)
        </Typography>
        <FormControl sx={{ width: '100%', maxWidth: '400px' }}>
          <input
            accept="image/jpeg,image/png,image/jpg,application/pdf"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            onChange={(e) => handleFileChange(e, addNotification)}
            disabled={isSubmitting}
          />
          <label htmlFor="file-upload" style={{ width: '100%' }}>
            <Button
              variant="outlined"
              component="span"
              fullWidth
              disabled={isSubmitting}
              sx={buttonStyles.fileUpload}
            >
              Upload File (JPG, PNG, PDF)
            </Button>
          </label>
          {formData.file && (
            <Typography variant="body2" sx={{ 
              mt: 2, 
              color: '#000000',
              backgroundColor: '#f8f8f8',
              p: 2,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px dashed #000000',
              width: '100%',
              ...commonStyles.poppinsText
            }}>
              Selected file: {formData.file.name}
            </Typography>
          )}
        </FormControl>
      </Box>
    </>
  );
};

export default MessageAndAttachmentSection; 