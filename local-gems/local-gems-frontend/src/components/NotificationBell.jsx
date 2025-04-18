import React, { useState, useEffect } from 'react';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  Chip
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { format } from 'date-fns';

const NotificationBell = ({ notifications = [] }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Count unread notifications (those with 'pending' status)
    const count = notifications.filter(notif => notif.bookingStatus === 'pending').length;
    setUnreadCount(count);
    // Add a console log to debug the count
    console.log('Unread notifications:', count);
  }, [notifications]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'success';
      case 'declined':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ position: 'relative' }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxHeight: 400,
            width: '350px',
            overflow: 'auto'
          }
        }}
      >
        {notifications.length === 0 ? (
          <MenuItem>
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </MenuItem>
        ) : (
          notifications.map((notification, index) => (
            <Box key={notification._id || index} sx={{ width: '100%' }}>
              <Card sx={{ boxShadow: 'none' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {notification.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {notification.message}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(notification.date), 'MMM dd, yyyy HH:mm')}
                    </Typography>
                    <Chip
                      label={notification.bookingStatus}
                      size="small"
                      color={getStatusColor(notification.bookingStatus)}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>
                </CardContent>
              </Card>
              {index < notifications.length - 1 && <Divider />}
            </Box>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;