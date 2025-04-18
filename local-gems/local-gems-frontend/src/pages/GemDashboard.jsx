import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import NotificationBell from '../components/NotificationBell';
import axios from 'axios';

const GemDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleBookingResponse = async (notificationId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/auth/update-booking-status',
        { notificationId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications(); // Refresh notifications
      setDialogOpen(false);
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gem Dashboard
        </Typography>
        <NotificationBell notifications={notifications} />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            {/* Add more dashboard content here */}
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Booking Request</DialogTitle>
        <DialogContent>
          <Typography>
            {selectedNotification?.message}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleBookingResponse(selectedNotification?._id, 'declined')} color="error">
            Decline
          </Button>
          <Button onClick={() => handleBookingResponse(selectedNotification?._id, 'accepted')} color="primary" variant="contained">
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GemDashboard;