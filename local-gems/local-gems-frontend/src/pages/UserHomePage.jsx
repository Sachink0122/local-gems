import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ExitToApp } from '@mui/icons-material';
import { 
  AppBar,
  Avatar,
  Box, 
  Button, 
  Card, 
  CardContent, 
  Container, 
  Grid, 
  TextField,
  Toolbar,
  Typography,
  Link,
  Divider,
  Stack
} from '@mui/material';

const UserHomePage = () => {
  const [gems, setGems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchGems = async () => {
      try {
        const response = await axios.get('/api/auth/completed-gems', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setGems(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching gems:', error);
        setError(error.response?.data?.msg || 'Failed to load gems');
        setLoading(false);
      }
    };

    fetchGems();
  }, [navigate]);

  const handleBookGem = async (gemId) => {
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/auth/notify-gem/${gemId}`, {
        date: selectedDate
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Booking request sent successfully!');
    } catch (error) {
      console.error('Error booking gem:', error);
      setError(error.response?.data?.msg || 'Failed to send booking request');
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom, #e0f7fa, #ffffff)',
      paddingBottom: 4
    }}>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main' }}>{username?.charAt(0) || 'U'}</Avatar>
            <Typography>{username || 'User'}</Typography>
            <Button
              color="inherit"
              onClick={() => navigate('/book-gems')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#4caf50',
                color: '#fff',
                padding: '8px 16px',
                fontWeight: 'bold',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#388e3c',
                }
              }}
            >
              Book Gems
            </Button>
            <Button
              color="inherit"
              onClick={handleLogout}
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f44336',
                color: '#fff',
                padding: '8px 16px',
                fontWeight: 'bold',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#d32f2f',
                }
              }}
            >
              <ExitToApp sx={{ marginRight: 1 }} />
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold', 
            mb: 6, 
            textAlign: 'center',
            color: 'primary.main',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          Welcome to LocalGems
        </Typography>
        
        <Box sx={{ mb: 6, p: 4, backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">About LocalGems</Typography>
          <Typography paragraph>
            LocalGems connects you with talented individuals in your community. Discover hidden talents for events, projects, or personal needs.
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="primary">🌟 Verified Talents</Typography>
              <Typography variant="body2">All our gems go through a verification process to ensure quality.</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="primary">📅 Easy Booking</Typography>
              <Typography variant="body2">Simple and secure booking process with just a few clicks.</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="primary">💎 Unique Experiences</Typography>
              <Typography variant="body2">Find talents you won't discover anywhere else.</Typography>
            </Grid>
          </Grid>
        </Box>

          {loading ? (
            <Typography variant="h6" align="center">Loading gems...</Typography>
          ) : error ? (
            <Typography variant="h6" color="error" align="center">{error}</Typography>
          ) : Array.isArray(gems) && gems.length > 0 ? (
            <Grid container spacing={3} justifyContent="center">
              {gems.map((gem) => (
                <Grid item xs={12} sm={6} md={4} key={gem._id}>
                  <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease',
                  borderRadius: 3,
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                  },
                  background: 'linear-gradient(145deg, #ffffff, #e6f7ff)',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(to right, #4caf50, #2196f3)'
                  }
                }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography 
                        gutterBottom 
                        variant="h5" 
                        component="h2"
                        sx={{ 
                          color: 'primary.main', 
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <span style={{ 
                          display: 'inline-block',
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#4caf50'
                        }}></span>
                        {gem.name}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body1">
                          <span style={{ fontWeight: 'bold' }}>Talent:</span> {gem.talent}
                        </Typography>
                        <Typography variant="body1">
                          <span style={{ fontWeight: 'bold' }}>Location:</span> {gem.location}
                        </Typography>
                        <Typography variant="body1">
                          <span style={{ fontWeight: 'bold' }}>Category:</span> {gem.category}
                        </Typography>
                        <Typography variant="body1">
                          <span style={{ fontWeight: 'bold' }}>Experience:</span> {gem.experience} years
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Rating:</Typography>
                          <Box sx={{ display: 'flex' }}>
                            {[...Array(5)].map((_, i) => (
                              <span key={i} style={{ color: i < Math.floor(gem.rating || 4) ? '#ffc107' : '#e0e0e0' }}>★</span>
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      />
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleBookGem(gem._id)}
                        disabled={!selectedDate}
                        sx={{
                          fontWeight: 'bold',
                          py: 1.5,
                          '&:hover': {
                            transform: 'scale(1.02)'
                          }
                        }}
                      >
                        Book Now
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="h6" align="center">No gems available</Typography>
          )}
        </Container>
      
      {/* Footer */}
      <Box component="footer" sx={{ 
        py: 4, 
        px: 2, 
        mt: 'auto', 
        backgroundColor: 'primary.main',
        color: 'white'
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>LocalGems</Typography>
              <Typography variant="body2">Connecting communities through talent.</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>Quick Links</Typography>
              <Stack spacing={1}>
                <Link href="#" color="inherit" underline="hover">Home</Link>
                <Link href="#" color="inherit" underline="hover">Book Gems</Link>
                <Link href="#" color="inherit" underline="hover">About Us</Link>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>Contact Us</Typography>
              <Typography variant="body2">Email: contact@localgems.com</Typography>
              <Typography variant="body2">Phone: (123) 456-7890</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2, backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} LocalGems. All rights reserved.
          </Typography>
        </Container>
      </Box>
      </Box>
  );
};

export default UserHomePage;