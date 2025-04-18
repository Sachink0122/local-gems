import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Container, 
  Grid, 
  TextField,
  Typography,
  Divider,
  Stack,
  Paper,
  Avatar
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

export default function BookGemsPage() {
  const [gems, setGems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/gems', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setGems(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to load gems');
        setLoading(false);
      }
    };

    fetchGems();
  }, []);

  const handleBook = async (gemId) => {
    if (!selectedDate) {
      setError('Please select a date');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/bookings`, {
        gemId,
        date: selectedDate
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Booking request sent successfully!');
      navigate('/user-home');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to book gem');
    }
  };

  const filteredGems = gems.filter(gem => 
    gem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gem.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Book Local Gems
        </Typography>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Search gems"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flex: 1 }}
            />
            <DatePicker
              label="Select date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </Stack>
        </Paper>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
      </Box>

      {loading ? (
        <Typography>Loading gems...</Typography>
      ) : filteredGems.length === 0 ? (
        <Typography>No gems found matching your search.</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredGems.map((gem) => (
            <Grid item xs={12} sm={6} md={4} key={gem._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Avatar src={gem.image} alt={gem.name} />
                    <Typography variant="h6" fontWeight="bold">
                      {gem.name}
                    </Typography>
                  </Stack>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {gem.category}
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    {gem.description}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={() => handleBook(gem._id)}
                    disabled={!selectedDate}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}