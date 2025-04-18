import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, Avatar } from '@mui/material';
import axios from 'axios';

const Chat = ({ gemId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [gemProfile, setGemProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/auth/messages/${gemId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    const fetchGemProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/auth/gem-profile/${gemId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGemProfile(res.data);
      } catch (err) {
        console.error('Error fetching gem profile:', err);
      }
    };

    fetchMessages();
    fetchGemProfile();
  }, [gemId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/auth/messages', {
        gemId,
        content: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2 }}>{gemProfile?.name?.charAt(0)}</Avatar>
          <Typography variant="h6">{gemProfile?.name}</Typography>
          <Button 
            sx={{ ml: 'auto' }} 
            onClick={() => setShowProfile(!showProfile)}
          >
            {showProfile ? 'Hide Profile' : 'View Profile'}
          </Button>
        </CardContent>
      </Card>

      {showProfile && gemProfile && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">Gem Profile</Typography>
            <Typography>Location: {gemProfile.location}</Typography>
            <Typography>Talent: {gemProfile.talent}</Typography>
            <Typography>Category: {gemProfile.category}</Typography>
            <Typography>Experience: {gemProfile.experience}</Typography>
          </CardContent>
        </Card>
      )}

      <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
        {messages.map((msg, index) => (
          <Box 
            key={index} 
            sx={{ 
              display: 'flex', 
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              mb: 1
            }}
          >
            <Card sx={{ maxWidth: '70%' }}>
              <CardContent>
                <Typography>{msg.content}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(msg.createdAt).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <Button 
          variant="contained" 
          sx={{ ml: 1 }} 
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;