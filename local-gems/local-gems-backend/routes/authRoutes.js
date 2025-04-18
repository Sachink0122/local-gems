const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/User');
const { auth, isAdmin, isGem } = require('../middleware/authMiddleware');

// ==============================
// PUBLIC ROUTES
// ==============================
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/register', upload.single('idProof'), authController.register);
router.post('/login', authController.login);

// ==============================
// PROTECTED ROUTES
// ==============================

router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOTP);
router.post('/reset-password', authController.resetPassword);


// Update gem profile (only for authenticated gems)
router.put('/update-profile', auth, isGem, authController.updateProfile);

// ==============================
// GEM ROUTES (Protected)
// ==============================
router.get('/profile', auth, isGem, authController.getProfile);
router.get('/notifications', auth, isGem, authController.getNotifications);
router.post('/notifications', auth, isGem, authController.addNotification);

// ==============================
// ADMIN ROUTES (Protected)
// ==============================
router.get('/users', auth, isAdmin, authController.getAllUsers);
router.get('/gems', auth, authController.getAllGems);
router.put('/verify-gem/:id', auth, isAdmin, authController.verifyGem);
router.delete('/delete-user/:id', auth, isAdmin, authController.deleteUser);

// ==============================
// CURRENT USER INFO
// ==============================
router.get('/me', auth, authController.getMe);

// ==============================
// USER → GEM BOOKING NOTIFICATION
// ==============================
router.put('/notify-gem/:id', auth, async (req, res) => {
  try {
    const gemId = req.params.id;
    const { date } = req.body;  // Get the selected date from the request body
    const user = req.user;

    const gem = await User.findById(gemId);
    if (!gem || gem.role !== 'gem') {
      return res.status(404).json({ msg: 'Gem not found' });
    }

    // Create a message including the booking date
    const notificationMessage = `${user.name} has sent you a booking request for ${date}. Please accept or decline the booking.`;

    gem.notifications.push({
      userId: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile || '',
      message: notificationMessage,
      bookingStatus: 'pending',  // Initially set as 'pending'
      date: new Date(),
    });

    // Create user notification about sending the booking request
    await User.findByIdAndUpdate(user._id, {
      $push: {
        notifications: {
          userId: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile || '',
          message: `You have sent a booking request to ${gem.name} for ${date}. Waiting for response.`,
          bookingStatus: 'pending',  // Initial status for the user is also 'pending'
          date: new Date(),
        }
      }
    });

    await gem.save();
    res.json({ msg: 'Notification sent to gem!' });
  } catch (error) {
    console.error('Error notifying gem:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ==============================
// GEM ACCEPT/DECLINE BOOKING
// ==============================
router.put('/update-booking-status/:notificationId', auth, async (req, res) => {
  try {
    const { notificationId, status } = req.body; // status = 'accepted' or 'declined'
    const user = req.user;

    // Find the gem's notification with the given notificationId
    const gem = await User.findOne({ 'notifications._id': notificationId });
    if (!gem || gem.role !== 'gem') {
      return res.status(404).json({ msg: 'Gem not found' });
    }

    const notification = gem.notifications.id(notificationId);
    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }

    // Update the gem's notification
    notification.bookingStatus = status;
    await gem.save();

    // Update the user's notification with booking status
    const userNotifications = await User.findById(user._id);
    const userNotification = userNotifications.notifications.find(
      (notif) => notif.userId.toString() === gem._id.toString() && notif.bookingStatus === 'pending'
    );
    
    if (userNotification) {
      userNotification.bookingStatus = status;
      await userNotifications.save();
    }

    // Send confirmation response
    res.json({ msg: `Booking ${status}` });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ==============================
// FETCH COMPLETED GEMS FOR USERS
// ==============================
router.get('/completed-gems', auth, async (req, res) => {
  try {
    const allGems = await User.find({ role: 'gem' }).select('-password');
    res.json(allGems);
  } catch (error) {
    console.error('Error fetching gems:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add a review to a gem
router.post('/gems/:id/review', auth, async (req, res) => {
  try {
    const gemId = req.params.id;
    const { rating, comment } = req.body;
    const reviewer = req.user;
    const gem = await User.findById(gemId);
    if (!gem || gem.role !== 'gem') {
      return res.status(404).json({ msg: 'Gem not found' });
    }
    gem.reviews.push({
      reviewer: reviewer._id,
      reviewerName: reviewer.name,
      rating,
      comment,
      date: new Date()
    });
    await gem.save();
    res.status(201).json({ msg: 'Review added successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to add review', error: err.message });
  }
});

// Like a gem
router.post('/gems/:id/like', auth, async (req, res) => {
  try {
    const gemId = req.params.id;
    const user = req.user;
    const gem = await User.findById(gemId);
    if (!gem || gem.role !== 'gem') {
      return res.status(404).json({ msg: 'Gem not found' });
    }
    // Prevent duplicate likes
    if (gem.likes.some(like => like.user.toString() === user._id.toString())) {
      return res.status(400).json({ msg: 'You have already liked this gem' });
    }
    gem.likes.push({ user: user._id, date: new Date() });
    await gem.save();
    res.status(201).json({ msg: 'Gem liked successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to like gem', error: err.message });
  }
});
module.exports = router;
