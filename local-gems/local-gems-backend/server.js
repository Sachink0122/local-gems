// ✅ server.js or index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcryptjs');

// Initialize the app
const app = express();

// Use CORS and JSON middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Models & Utils
const User = require('./models/User');

// 🛠️ Create default admin if not exists
const createDefaultAdmin = async () => {
  try {
    // Check if admin exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      // Create a hashed password for the default admin
      const hashedPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD || 'admin123', 10);
      
      // Create a new admin
      await User.create({
        name: 'Admin',
        email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@localgems.com',
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
      });

      console.log('✅ Default admin created: admin@localgems.com');
    } else {
      console.log('✅ Admin already exists');
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error.message);
  }
};

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    
    // Create default admin if needed
    await createDefaultAdmin();
    
    // Start the server
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Example of environment variables:
// MONGO_URI=mongodb://localhost:27017/localgems
// DEFAULT_ADMIN_EMAIL=admin@localgems.com
// DEFAULT_ADMIN_PASSWORD=admin123
  