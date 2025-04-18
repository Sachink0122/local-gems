import { ExitToApp, Notifications } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GemsPage = () => {
  const [gem, setGem] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    socialLink: '',
    talent: '',
    location: '',
    category: '',
    experience: ''
  });

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchGemData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGem(res.data);
      setFormData({
        name: res.data.name || '',
        email: res.data.email || '',
        mobile: res.data.mobile || '',
        socialLink: res.data.socialLink || '',
        talent: res.data.talent || '',
        location: res.data.location || '',
        category: res.data.category || '',
        experience: res.data.experience || ''
      });
    } catch (err) {
      console.error(err);
      alert('Failed to load gem data.');
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    fetchGemData();
    fetchNotifications();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('http://localhost:5000/api/auth/update-profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.msg || 'Profile updated successfully!');
      fetchGemData();
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
    }
  };

  return (
    <Box sx={{ background: 'linear-gradient(to bottom, #e0f7fa, #ffffff)', minHeight: '100vh' }}>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight="bold">LocalGems</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Notifications onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ cursor: 'pointer' }} />
            <Typography>{gem?.name}</Typography>
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
                },
                '&:focus': {
                  outline: 'none',
                },
              }}
            >
              <ExitToApp sx={{ marginRight: 1 }} />
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{ sx: { maxHeight: 300 } }}
      >
        {notifications.length > 0 ? (
          notifications.map((note, i) => (
            <MenuItem key={i} divider>
              <ListItemText
                primary={`📢 New Booking Alert! ${note.name}`}
                secondary={`📞 Contact: ${note.mobile}`}
              />
            </MenuItem>
          ))
        ) : (
          <MenuItem>No notifications</MenuItem>
        )}
      </Menu>

      <Container sx={{ py: 5 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Gem Profile Page
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {Object.entries(formData).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
              ))}
            </Grid>
            <Box mt={3} textAlign="right">
              <Button type="submit" variant="contained" color="primary">
                Update Profile
              </Button>
            </Box>
          </form>
        </Paper>

        {gem && (
          <Paper elevation={3} sx={{ mt: 4, p: 3, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Profile Summary
            </Typography>
            <Typography><strong>Name:</strong> {gem.name}</Typography>
            <Typography><strong>Email:</strong> {gem.email}</Typography>
            <Typography><strong>Mobile:</strong> {gem.mobile}</Typography>
            <Typography>
              <strong>Social:</strong>{' '}
              <a href={gem.socialLink} target="_blank" rel="noreferrer">{gem.socialLink}</a>
            </Typography>
            <Typography><strong>Talent:</strong> {gem.talent}</Typography>
            <Typography><strong>Location:</strong> {gem.location}</Typography>
            <Typography><strong>Category:</strong> {gem.category}</Typography>
            <Typography><strong>Experience:</strong> {gem.experience} years</Typography>
            <Typography><strong>Verified:</strong> {gem.isVerified ? '✅ Yes' : '❌ No'}</Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default GemsPage;
