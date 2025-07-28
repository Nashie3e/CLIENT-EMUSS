import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Chip } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

const UpdateCard = ({ update }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar sx={{ mr: 2 }}>
            {update.user?.name ? update.user.name[0] : 'U'}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">
              {update.user?.name || 'System Update'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
            </Typography>
          </Box>
          {update.newStatus && (
            <Chip 
              label={update.newStatus.replace(/_/g, ' ')}
              color={update.newStatus === 'RESOLVED' ? 'success' : 
                     update.newStatus === 'IN_PROGRESS' ? 'info' : 
                     update.newStatus === 'PENDING' ? 'warning' : 'default'}
              size="small"
              sx={{ ml: 1 }}
            />
          )}
        </Box>
        <Typography variant="body1" sx={{ mb: 1 }}>{update.comment}</Typography>
      </CardContent>
    </Card>
  );
};

export default UpdateCard; 