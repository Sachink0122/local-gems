import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';

const RegisterGem = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    socialLink: '',
    talent: '',
    location: '',
    password: '',
    retypepassword: '',
    idProof: null,
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.retypepassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) formDataToSend.append(key, value);
      });
      formDataToSend.append('role', 'gem');

      await axios.post('http://localhost:5000/api/auth/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccessMsg('Gem Registered! Wait for admin verification.');
      setFormData({
        name: '',
        email: '',
        mobile: '',
        socialLink: '',
        talent: '',
        location: '',
        password: '',
        retypepassword: '',
        idProof: null,
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
        background: 'linear-gradient(135deg, #FDC830 0%, #F37335 100%)',
        px: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 500,
          borderRadius: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          color: '#333',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #FDC830 0%, #F37335 100%)',
          },
        }}
      >
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2}>
          ✨ Gem Registration ✨
        </Typography>

        <Typography variant="body1" textAlign="center" mb={3}>
          Join our community of talented <strong>LocalGems</strong> and showcase your skills!
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
                    borderColor: '#FDC830',
                  },
                  '&:hover fieldset': {
                    borderColor: '#F37335',
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
              variant="outlined"
            />
            <TextField
              label="Social Media Link"
              name="socialLink"
              value={formData.socialLink}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
            />
            <TextField
              label="Talent"
              name="talent"
              value={formData.talent}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
            />
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
            />
            <TextField
              label="Retype Password"
              name="retypepassword"
              type="password"
              value={formData.retypepassword}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
            />
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ 
                borderColor: '#FDC830',
                color: '#F37335',
                '&:hover': {
                  borderColor: '#F37335',
                  backgroundColor: 'rgba(253, 200, 48, 0.08)',
                },
              }}
            >
              Upload Government ID Proof
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setFormData({ ...formData, idProof: e.target.files[0] });
                  }
                }}
              />
            </Button>
            {formData.idProof && (
              <Typography variant="caption" color="text.secondary">
                {formData.idProof.name} selected
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
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

export default RegisterGem;