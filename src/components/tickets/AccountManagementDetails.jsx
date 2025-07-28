import React from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
} from '@mui/material';
import { Launch as LaunchIcon, Description as FileIcon } from '@mui/icons-material';

const AccountManagementDetails = ({ ticket }) => {
  // Helper function to safely render values
  const renderValue = (value) => {
    if (!value) return 'Not specified';
    if (typeof value === 'object') {
      if (value.name) return value.name;
      return JSON.stringify(value);
    }
    return String(value);
  };

  return (
    <>
      <Typography variant="subtitle1" gutterBottom sx={{ fontFamily: 'Poppins' }}>
        Account Request Details
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary={
              <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'Poppins' }}>
                Email
              </Box>
            }
            secondary={
              <Box component="span" sx={{ color: '#333', mt: 0.5, fontFamily: 'Poppins', display: 'block' }}>
                {renderValue(ticket.email)}
              </Box>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'Poppins' }}>
                Account Type
              </Box>
            }
            secondary={
              <Box component="span" sx={{ color: '#333', mt: 0.5, fontFamily: 'Poppins' }}>
                {renderValue(ticket.accountType)}
              </Box>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'Poppins' }}>
                Action Type
              </Box>
            }
            secondary={
              <Box component="span" sx={{ color: '#333', mt: 0.5, fontFamily: 'Poppins' }}>
                {renderValue(ticket.actionType)}
              </Box>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              <Box component="span" sx={{ color: '#666', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'Poppins' }}>
                Subject
              </Box>
            }
            secondary={
              <Box component="span" sx={{ color: '#333', mt: 0.5, fontFamily: 'Poppins' }}>
                {renderValue(ticket.subject)}
              </Box>
            }
          />
        </ListItem>
      </List>

      {/* Shortcut Links Section */}
      <Box sx={{ mt: 3, mb: 2 }}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 600, 
            color: '#1976d2',
            mb: 2,
            fontFamily: 'Poppins'
          }}
        >
          Shortcut Links
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Gmail Forms */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1, fontFamily: 'Poppins' }}>
              Gmail Account Forms
            </Typography>
            <Button
              component="a"
              href="https://depedph-my.sharepoint.com/:x:/g/personal/icts_imus_deped_gov_ph/EeXmLbZsXjVEm3WORbJPGqwBLBDtctSQ2gwk5uQ8zGyYhA"
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              startIcon={<FileIcon />}
              endIcon={<LaunchIcon />}
              sx={{
                textTransform: 'none',
                borderColor: '#1976d2',
                color: '#1976d2',
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                padding: '10px 20px',
                fontWeight: 500,
                fontFamily: 'Poppins',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  borderColor: '#1565c0',
                },
                width: 'fit-content'
              }}
            >
              Access Gmail Forms (Creation & Reset)
            </Button>
          </Box>

          {/* M365 Form */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1, fontFamily: 'Poppins' }}>
              M365 Account Form
            </Typography>
            <Button
              component="a"
              href="https://docs.google.com/spreadsheets/d/1BYwMpR5GSgKU6z1F6bBJQ8m0YARCFvG0tEJnGgMmXyA/edit?gid=1081583692#gid=1081583692"
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              startIcon={<FileIcon />}
              endIcon={<LaunchIcon />}
              sx={{
                textTransform: 'none',
                borderColor: '#1976d2',
                color: '#1976d2',
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                padding: '10px 20px',
                fontWeight: 500,
                fontFamily: 'Poppins',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  borderColor: '#1565c0',
                },
                width: 'fit-content'
              }}
            >
              Access M365 Creation Form
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AccountManagementDetails; 