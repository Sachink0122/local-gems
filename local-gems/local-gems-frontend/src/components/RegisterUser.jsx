import {
  Alert,
  Avatar,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    retypepassword: '',
    profilePic: null,
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'mobile') {
      // Remove non-numeric characters
      const numericValue = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  
    setErrorMsg('');
    setSuccessMsg('');
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(formData.mobile)) {
      setErrorMsg('Mobile number must be exactly 10 digits.');
      return;
    }

    if (formData.password !== formData.retypepassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        ...formData,
        role: 'user',
      });
      setSuccessMsg('User Registered Successfully!');
      setFormData({
        name: '',
        email: '',
        mobile: '',
        password: '',
        retypepassword: '',
      });
    } catch (err) {
      setErrorMsg(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: 'linear-gradient(135deg,rgb(134, 69, 12) 0%,rgb(241, 180, 82) 100%)',
        px: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 450,
          borderRadius: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          color: '#333',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          },
        }}
      >
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2} sx={{ color: '#764ba2' }}>
          Register as User
        </Typography>

        <Typography variant="body1" textAlign="center" mb={3} sx={{ color: '#666' }}>
          Join <span style={{ color: '#764ba2', fontWeight: 'bold' }}>LocalGems</span> and discover local talent!
        </Typography>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}
        {successMsg && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMsg}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Avatar
                src={formData.profilePic ? URL.createObjectURL(formData.profilePic) : null}
                sx={{ width: 100, height: 100, border: '2px solid #764ba2' }}
              />
            </Box>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mb: 2 }}
            >
              Upload Profile Picture
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setFormData({ ...formData, profilePic: e.target.files[0] });
                  }
                }}
              />
            </Button>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#667eea',
                  },
                  '&:hover fieldset': {
                    borderColor: '#764ba2',
                  },
                },
              }}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              variant="filled"
              InputProps={{ style: { backgroundColor: '#fff', borderRadius: 8 } }}
            />
<TextField
  label="Mobile Number"
  name="mobile"
  value={formData.mobile}
  onChange={handleChange}
  fullWidth
  required
  variant="filled"
  inputProps={{
    maxLength: 10,
    inputMode: 'numeric',
    pattern: '[0-9]*'
  }}
  InputProps={{ style: { backgroundColor: '#fff', borderRadius: 8 } }}
/>


            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
              variant="filled"
              InputProps={{ style: { backgroundColor: '#fff', borderRadius: 8 } }}
            />
            <TextField
              label="Retype Password"
              name="retypepassword"
              type="password"
              value={formData.retypepassword}
              onChange={handleChange}
              fullWidth
              required
              variant="filled"
              InputProps={{ style: { backgroundColor: '#fff', borderRadius: 8 } }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{
                backgroundColor: '#FFA726',
                color: '#000',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#fb8c00',
                },
                borderRadius: 2,
                mt: 1,
              }}
            >
              REGISTER
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default RegisterUser;




