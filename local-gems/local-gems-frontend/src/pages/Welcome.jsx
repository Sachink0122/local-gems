import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/bg.png';

import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

const Welcome = () => {
  const [showRegisterOptions, setShowRegisterOptions] = useState(false);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}
    >
      <Paper
        elevation={10}
        sx={{
          bgcolor: 'rgba(255,255,255,0.95)',
          p: 5,
          borderRadius: 5,
          textAlign: 'center',
          maxWidth: 600,
          width: '100%',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          position: 'relative',
        }}
      >
        <Box sx={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
          <img src={bgImage} alt="Local Gems" style={{ width: 120, height: 120, borderRadius: '50%', border: '4px solid #ff9800', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }} />
        </Box>
        <Typography variant="h3" fontWeight="bold" mb={1} mt={6} sx={{ letterSpacing: 2, color: '#ff9800', textShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
          Local Gems
        </Typography>
        <Typography variant="h6" mb={3} sx={{ color: '#333', fontWeight: 500 }}>
          Discover, connect, and book talented individuals in your community.
        </Typography>
        <Grid container spacing={2} justifyContent="center" mb={3}>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="contained"
              sx={{
                background: 'linear-gradient(90deg, #ff9800 0%, #ffb74d 100%)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: 18,
                py: 1.5,
                borderRadius: 3,
                boxShadow: '0 2px 8px rgba(255,152,0,0.18)',
                mb: 1
              }}
              onClick={() => setShowRegisterOptions(!showRegisterOptions)}
            >
              Get Started
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                color: '#ff9800',
                borderColor: '#ff9800',
                fontWeight: 'bold',
                fontSize: 18,
                py: 1.5,
                borderRadius: 3,
                '&:hover': { background: '#fff3e0', borderColor: '#ff9800' }
              }}
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </Grid>
        </Grid>
        {showRegisterOptions && (
          <Box mt={2}>
            <Typography variant="subtitle1" color="#ff9800" gutterBottom fontWeight="bold">
              Register as:
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                sx={{ background: '#4caf50', color: 'white', fontWeight: 'bold', px: 4, py: 1.2, borderRadius: 2 }}
                onClick={() => navigate('/register-user')}
              >
                User
              </Button>
              <Button
                variant="contained"
                sx={{ background: '#1976d2', color: 'white', fontWeight: 'bold', px: 4, py: 1.2, borderRadius: 2 }}
                onClick={() => navigate('/register-gem')}
              >
                Gem Provider
              </Button>
            </Stack>
          </Box>
        )}
        <Box mt={5}>
          <Typography variant="body2" color="#888">
            ✨ Uncover hidden talents. Support your local community. ✨
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Welcome;



