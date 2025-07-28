import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

const CommentCard = ({ comment }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar sx={{ mr: 2 }}>{comment.user.name[0]}</Avatar>
          <Box>
            <Typography variant="subtitle1">{comment.user.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body1">{comment.content}</Typography>
      </CardContent>
    </Card>
  );
};

export default CommentCard; 