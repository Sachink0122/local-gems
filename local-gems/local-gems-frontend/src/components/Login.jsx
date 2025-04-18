// import {
//   Alert,
//   Box,
//   Button,
//   Paper,
//   Stack,
//   TextField,
//   Typography,
// } from '@mui/material';
// import axios from 'axios';
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [errorMsg, setErrorMsg] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setErrorMsg('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/login', formData);

//       localStorage.setItem('token', res.data.token);
//       localStorage.setItem('username', res.data.user.name);

//       const role = res.data.user.role;
//       alert(`Welcome ${res.data.user.name} (${role})`);

//       if (role === 'admin') {
//         navigate('/admin');
//       } else if (role === 'gem') {
//         navigate('/gemspage');
//       } else {
//         navigate('/user-home');
//       }
//     } catch (err) {
//       setErrorMsg(err.response?.data?.msg || 'Login failed');
//     }
//   };

//   return (
//     <Box
//       minHeight="100vh"
//       display="flex"
//       alignItems="center"
//       justifyContent="center"
//       sx={{
//         background: 'linear-gradient(to right, #f3904f, #3b4371)',
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         px: 2,
//       }}
//     >
//       <Paper
//         elevation={8}
//         sx={{
//           p: 4,
//           width: '100%',
//           maxWidth: 420,
//           borderRadius: 3,
//           backgroundColor: 'rgba(0, 0, 0, 0.8)',
//           color: '#fff',
//           backdropFilter: 'blur(6px)',
//         }}
//       >
//         <Typography
//           variant="h4"
//           fontWeight="bold"
//           textAlign="center"
//           mb={2}
//         >
//           Welcome Back
//         </Typography>

//         <Typography variant="body1" textAlign="center" mb={3}>
//           Login to <span style={{ color: '#FFA726' }}>LocalGems</span>
//         </Typography>

//         {errorMsg && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {errorMsg}
//           </Alert>
//         )}

//         <form onSubmit={handleSubmit}>
//           <Stack spacing={2}>
//             <TextField
//               label="Email"
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//               fullWidth
//               required
//               variant="filled"
//               InputProps={{
//                 style: { backgroundColor: '#fff', borderRadius: 8 },
//               }}
//             />
//             <TextField
//               label="Password"
//               name="password"
//               type="password"
//               value={formData.password}
//               onChange={handleChange}
//               fullWidth
//               required
//               variant="filled"
//               InputProps={{
//                 style: { backgroundColor: '#fff', borderRadius: 8 },
//               }}
//             />
//             <Button
//               type="submit"
//               variant="contained"
//               size="large"
//               fullWidth
//               sx={{
//                 backgroundColor: '#FFA726',
//                 color: '#000',
//                 fontWeight: 'bold',
//                 '&:hover': {
//                   backgroundColor: '#fb8c00',
//                 },
//                 borderRadius: 2,
//                 mt: 1,
//               }}
//             >
//               LOGIN
//             </Button>
//           </Stack>
//         </form>
//       </Paper>
//     </Box>
//   );
// };

// export default Login;




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
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState('login'); // login | forgot | reset
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [role, setRole] = useState('user'); // user | admin | gem
  const navigate = useNavigate();
  const [forgotToken, setForgotToken] = useState(''); // Store the token here

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  }


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'password') {
      checkPasswordStrength(value);
    }
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { ...formData, role });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.user.name);
      localStorage.setItem('role', res.data.user.role);
      const roleRes = res.data.user.role;
      alert(`Welcome ${res.data.user.name} (${roleRes})`);
      if (roleRes === 'admin') navigate('/admin');
      else if (roleRes === 'gem') navigate('/gemspage');
      else navigate('/user-home');
    } catch (err) {
      setErrorMsg(err.response?.data?.msg || 'Login failed');
    }
  };

  const [otp, setOtp] = useState('');

  const handleForgotPassword = async () => {
    if (!forgotEmail) return setErrorMsg('Please enter your email');
    try {
        await axios.post('http://localhost:5000/api/auth/forgot-password', { email: forgotEmail });
        setSuccessMsg('OTP sent to your email');
        setStep('verify-otp');
        setErrorMsg('');
    } catch (err) {
        setErrorMsg(err.response?.data?.msg || 'Failed to send OTP');
    }
};

  const handleVerifyOTP = async () => {
    if (!otp) return setErrorMsg('Please enter OTP');
    try {
        const response = await axios.post('http://localhost:5000/api/auth/verify-otp', { 
            email: forgotEmail,
            otp: otp
        });
        setForgotToken(response.data.token);
        setSuccessMsg('OTP verified. Now enter new password.');
        setStep('reset');
        setErrorMsg('');
    } catch (err) {
        setErrorMsg(err.response?.data?.msg || 'Invalid OTP');
    }
};


  const handleResetPassword = async () => {
    if (!newPassword) return setErrorMsg('Enter new password');
    try {
        await axios.post('http://localhost:5000/api/auth/reset-password', {
            token: forgotToken, // Use token here
            newPassword, // Send newPassword as expected by backend
        });
        setSuccessMsg('Password reset successful. You can login now.');
        setStep('login');
        setForgotEmail('');
        setNewPassword('');
    } catch (err) {
        setErrorMsg(err.response?.data?.msg || 'Failed to reset password');
    }
};

  

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: 'linear-gradient(to right, #f3904f, #3b4371)',
        px: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 420,
          borderRadius: 3,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          backdropFilter: 'blur(6px)',
        }}
      >
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2}>
          {step === 'login'
            ? 'Welcome Back'
            : step === 'forgot'
            ? 'Forgot Password'
            : 'Reset Password'}
        </Typography>

        {step === 'login' && (
          <Typography variant="body1" textAlign="center" mb={3}>
            Login to <span style={{ color: '#FFA726' }}>LocalGems</span>
          </Typography>
        )}

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

        {step === 'login' && (
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                <Button
                  variant={role === 'user' ? 'contained' : 'outlined'}
                  sx={{ background: role === 'user' ? 'linear-gradient(90deg, #ff9800 0%, #ffb74d 100%)' : 'transparent', color: role === 'user' ? 'white' : '#ff9800', borderColor: '#ff9800', fontWeight: 'bold', borderRadius: 3 }}
                  onClick={() => setRole('user')}
                >
                  User
                </Button>
                <Button
                  variant={role === 'admin' ? 'contained' : 'outlined'}
                  sx={{ background: role === 'admin' ? 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)' : 'transparent', color: role === 'admin' ? 'white' : '#1976d2', borderColor: '#1976d2', fontWeight: 'bold', borderRadius: 3 }}
                  onClick={() => setRole('admin')}
                >
                  Admin
                </Button>
                <Button
                  variant={role === 'gem' ? 'contained' : 'outlined'}
                  sx={{ background: role === 'gem' ? 'linear-gradient(90deg, #4caf50 0%, #81c784 100%)' : 'transparent', color: role === 'gem' ? 'white' : '#4caf50', borderColor: '#4caf50', fontWeight: 'bold', borderRadius: 3 }}
                  onClick={() => setRole('gem')}
                >
                  Gem
                </Button>
              </Box>
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
              <Box>
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="filled"
                  helperText="Password must contain at least 8 characters, including uppercase, lowercase, number, and special character"
                  InputProps={{ style: { backgroundColor: '#fff', borderRadius: 8 } }}
                />
                {formData.password && (
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ mr: 1 }}>Password Strength:</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {[...Array(5)].map((_, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: 30,
                            height: 4,
                            backgroundColor: index < passwordStrength
                              ? index < 2 ? '#f44336' : index < 4 ? '#ffa726' : '#4caf50'
                              : '#e0e0e0',
                            borderRadius: 1
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
              <Typography
                variant="body2"
                textAlign="right"
                sx={{ cursor: 'pointer', color: '#FFA726' }}
                onClick={() => {
                  setStep('forgot');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
              >
                Forgot Password?
              </Typography>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  background: 'linear-gradient(90deg, #ff9800 0%, #ffb74d 100%)',
                  color: '#000',
                  fontWeight: 'bold',
                  '&:hover': { background: '#fb8c00' },
                  borderRadius: 2,
                  mt: 1,
                }}
              >
                LOGIN
              </Button>
            </Stack>
          </form>
        )}

        {step === 'forgot' && (
          <Stack spacing={2}>
            <TextField
              label="Enter your email"
              type="email"
              value={forgotEmail}
              onChange={(e) => {
                setForgotEmail(e.target.value);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              fullWidth
              required
              variant="filled"
              InputProps={{
                style: { backgroundColor: '#fff', borderRadius: 8 },
              }}
            />
            <Button
              variant="contained"
              onClick={handleForgotPassword}
              sx={{
                backgroundColor: '#FFA726',
                color: '#000',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: '#fb8c00' },
                borderRadius: 2,
              }}
            >
              Send OTP
            </Button>
            <Button
              onClick={() => {
                setStep('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              sx={{ color: '#FFA726' }}
            >
              Back to Login
            </Button>
          </Stack>
        )}

        {step === 'verify-otp' && (
          <Stack spacing={2}>
            <TextField
              label="Enter OTP"
              type="text"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              fullWidth
              required
              variant="filled"
              InputProps={{
                style: { backgroundColor: '#fff', borderRadius: 8 },
              }}
            />
            <Button
              variant="contained"
              onClick={handleVerifyOTP}
              sx={{
                backgroundColor: '#FFA726',
                color: '#000',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: '#fb8c00' },
                borderRadius: 2,
              }}
            >
              Verify OTP
            </Button>
            <Button
              onClick={() => {
                setStep('forgot');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              sx={{ color: '#FFA726' }}
            >
              Back
            </Button>
          </Stack>
        )}

        {step === 'reset' && (
          <Stack spacing={2}>
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              fullWidth
              required
              variant="filled"
              InputProps={{
                style: { backgroundColor: '#fff', borderRadius: 8 },
              }}
            />
            <Button
              variant="contained"
              onClick={handleResetPassword}
              sx={{
                backgroundColor: '#FFA726',
                color: '#000',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: '#fb8c00' },
                borderRadius: 2,
              }}
            >
              Reset Password
            </Button>
          </Stack>
        )}
      </Paper>
    </Box>
  );
};

export default Login;
