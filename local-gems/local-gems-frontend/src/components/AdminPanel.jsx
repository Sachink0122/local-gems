import { Delete, Verified } from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Toolbar,
  Typography
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const COLORS = ['#4caf50', '#f44336'];

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [gems, setGems] = useState([]);
  const [view, setView] = useState('');

  const fetchAll = async () => {
    const token = localStorage.getItem('token');
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    const usersRes = await axios.get('http://localhost:5000/api/auth/users', headers);
    const gemsRes = await axios.get('http://localhost:5000/api/auth/gems', headers);
    setUsers(usersRes.data);
    setGems(gemsRes.data);
  };

  const verifyGem = async (id) => {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:5000/api/auth/verify-gem/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchAll();
  };

  const deleteUser = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/auth/delete-user/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchAll();
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const verifiedCount = gems.filter(g => g.isVerified).length;
  const unverifiedCount = gems.length - verifiedCount;

  const pieData = [
    { name: 'Verified', value: verifiedCount },
    { name: 'Unverified', value: unverifiedCount },
  ];

  const barData = [
    { name: 'Users', count: users.length },
    { name: 'Gems', count: gems.length },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #3f0d75 0%, #1a237e 100%)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.1) 90%)',
        zIndex: -1
      }
    }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight="bold" color="inherit">
            Admin Dashboard
          </Typography>
          <Button
            color="inherit"
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
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
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <Grid container spacing={3} justifyContent="center" mb={4}>
          {[{ label: 'Total Users', value: users.length, color: '#bbdefb' },
            { label: 'Total Gems', value: gems.length, color: '#e1bee7' },
            { label: 'Verified Gems', value: verifiedCount, color: '#ffcdd2' }].map((item, idx) => (
            <Grid item xs={12} sm={4} key={idx}>
              <Paper elevation={3} sx={{ 
                p: 2, 
                textAlign: 'center', 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 3,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                },
                background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
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
                <Typography variant="subtitle2">{item.label}</Typography>
                <Typography variant="h5" fontWeight="bold">{item.value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4} mb={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, height: 400, borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom>Gem Verification Status</Typography>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={120} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, height: 400, borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom>User vs Gem Count</Typography>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2} justifyContent="center" mb={3}>
          <Button variant="contained" onClick={() => setView('users')}>Registered Users</Button>
          <Button variant="contained" color="secondary" onClick={() => setView('gems')}>Registered Gems</Button>
        </Stack>

        {view === 'users' && (
          <Grid item xs={12}>
            {users.map(u => (
              <Card key={u._id} sx={{ mb: 2 }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>{u.name.charAt(0)}</Avatar>
                    <Typography variant="body1" fontWeight="bold">{u.name}</Typography>
                  </Stack>
                  <Divider sx={{ my: 1 }} />
                  <Stack spacing={1}>
                    <Typography variant="body2">📧 Email: {u.email}</Typography>
                    <Typography variant="body2">📱 Mobile: {u.mobile}</Typography>
                    <Typography variant="body2">📅 Registered: {new Date(u.createdAt).toLocaleDateString()}</Typography>
                  </Stack>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Button variant="outlined" color="error" size="small" startIcon={<Delete />} onClick={() => deleteUser(u._id)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Grid>
        )}

        {view === 'gems' && (
          <Grid item xs={12}>
            {gems.map(g => (
              <Card key={g._id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">{g.name}</Typography>
                  <Typography variant="body2">📞 {g.mobile} | 📍 {g.location}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>🔗 <a href={g.socialLink} target="_blank" rel="noreferrer">{g.socialLink}</a></Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>✅ Verified: {g.isVerified ? 'Yes' : 'No'}</Typography>
                  {g.idProof && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2">📄 ID Proof:</Typography>
                      <a href={`http://localhost:5000/${g.idProof}`} target="_blank" rel="noreferrer">
                        View ID Proof
                      </a>
                    </Box>
                  )}
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  {!g.isVerified && (
                    <Button variant="contained" color="success" size="small" startIcon={<Verified />} onClick={() => verifyGem(g._id)}>
                      Verify
                    </Button>
                  )}
                  <Button variant="outlined" color="error" size="small" startIcon={<Delete />} onClick={() => deleteUser(g._id)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default AdminPanel;