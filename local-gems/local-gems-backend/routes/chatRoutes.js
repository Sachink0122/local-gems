const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Get messages between user and gem
router.get('/messages/:gemId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const gem = await User.findById(req.params.gemId);
    
    if (!gem || gem.role !== 'gem') {
      return res.status(404).json({ msg: 'Gem not found' });
    }
    
    // Combine messages from both user and gem
    const messages = [
      ...user.messages.filter(msg => msg.gemId.toString() === req.params.gemId),
      ...gem.messages.filter(msg => msg.userId.toString() === req.user.id)
    ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Send message to gem
router.post('/messages', auth, async (req, res) => {
  try {
    const { gemId, content } = req.body;
    const gem = await User.findById(gemId);
    
    if (!gem || gem.role !== 'gem') {
      return res.status(404).json({ msg: 'Gem not found' });
    }
    
    // Add message to user's messages
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: {
          messages: {
            gemId,
            content,
            sender: 'user',
            createdAt: new Date()
          }
        }
      },
      { new: true }
    );
    
    // Add notification to gem
    await User.findByIdAndUpdate(
      gemId,
      {
        $push: {
          messages: {
            userId: req.user.id,
            content,
            sender: 'gem',
            createdAt: new Date()
          },
          notifications: {
            userId: req.user.id,
            name: user.name,
            message: `New message from ${user.name}: ${content}`,
            date: new Date()
          }
        }
      }
    );
    
    res.json({ msg: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get gem profile
router.get('/gem-profile/:gemId', auth, async (req, res) => {
  try {
    const gem = await User.findById(req.params.gemId).select('-password -messages');
    
    if (!gem || gem.role !== 'gem') {
      return res.status(404).json({ msg: 'Gem not found' });
    }
    
    res.json(gem);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;