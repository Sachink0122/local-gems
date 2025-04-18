const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email template for OTP
const generateEmailTemplate = (otp) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
          color: #333;
        }
        .header {
          background: linear-gradient(to right, #f3904f, #3b4371);
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #fff;
          padding: 30px;
          border-radius: 0 0 8px 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .logo {
          color: #fff;
          font-size: 24px;
          font-weight: bold;
          margin: 0;
        }
        .otp-box {
          background-color: #f8f9fa;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
          font-size: 24px;
          text-align: center;
          letter-spacing: 5px;
          font-weight: bold;
          color: #1976d2;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="logo">LocalGems</h1>
        </div>
        <div class="content">
          <h2>Password Reset OTP</h2>
          <p>Hello,</p>
          <p>You have requested to reset your password. Please use the following OTP to proceed:</p>
          <div class="otp-box">${otp}</div>
          <p>This OTP will expire in 10 minutes for security purposes.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>Best regards,<br>The LocalGems Team</p>
        </div>
        <div class="footer">
          <p>© 2025 LocalGems. All rights reserved.</p>
          <p>This is an automated email, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// REGISTER USER or GEM
exports.register = async (req, res) => {
    try {
        const { name, email, password, retypepassword, role } = req.body;
        const idProof = req.file ? req.file.path : null;

        // Password validation
        if (password.length < 8) {
            return res.status(400).json({
                msg: 'Password must be at least 8 characters long'
            });
        }

        if (password !== retypepassword) {
            return res.status(400).json({ 
                msg: 'Passwords do not match',
                field: 'retypepassword'
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        let newUser = new User({
            ...req.body,
            password: hashedPassword,
            retypepassword: '',
            isVerified: role === 'gem' ? false : true,
        });

        await newUser.save();
        res.status(201).json({ msg: 'Registration successful, waiting for verification if gem' });

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ msg: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        // Gem check
        if (user.role === 'gem' && !user.isVerified) {
            return res.status(403).json({ msg: 'Not verified by admin' });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        
        res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
        

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// GET USERS (ADMIN)
exports.getAllUsers = async (req, res) => {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
};

// GET GEMS (ADMIN)
exports.getAllGems = async (req, res) => {
    const gems = await User.find({ role: 'gem' }).select('-password');
    res.json(gems);
};

// VERIFY GEM SOCIAL LINK (ADMIN)
exports.verifyGem = async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndUpdate(id, { isVerified: true });
    res.json({ msg: 'Gem verified successfully' });
};

// DELETE USER/GEM (ADMIN)
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ msg: 'User deleted' });
};



// UPDATE GEM PROFILE
exports.updateProfile = async (req, res) => {
    try {
        const { name, mobile, socialLink, location, talent, category, experience } = req.body;

        // Ensure the user is a gem
        if (req.user.role !== 'gem') {
            return res.status(403).json({ msg: 'Access denied: Gems only' });
        }

        // Find the gem by ID and update the profile
        const updatedGem = await User.findByIdAndUpdate(
            req.user.id,
            { name, mobile, socialLink, location, talent, category, experience },
            { new: true, runValidators: true }
        ).select('-password');

        res.json({ msg: 'Profile updated successfully', user: updatedGem });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};





// GET GEM PROFILE
exports.getProfile = async (req, res) => {
    try {
        // Ensure the user is a gem
        if (req.user.role !== 'gem') {
            return res.status(403).json({ msg: 'Access denied: Gems only' });
        }

        // Find the gem by ID
        const gem = await User.findById(req.user.id).select('-password');
        if (!gem) {
            return res.status(404).json({ msg: 'Gem not found' });
        }

        res.json(gem);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// GET GEM NOTIFICATIONS
exports.getNotifications = async (req, res) => {
    try {
        // Ensure the user is a gem
        if (req.user.role !== 'gem') {
            return res.status(403).json({ msg: 'Access denied: Gems only' });
        }

        // Find the gem by ID
        const gem = await User.findById(req.user.id).select('notifications');
        if (!gem) {
            return res.status(404).json({ msg: 'Gem not found' });
        }

        res.json(gem.notifications);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// ADD NOTIFICATION TO GEM
exports.addNotification = async (req, res) => {
    try {
        const { gemId, message } = req.body;

        // Find the gem by ID
        const gem = await User.findById(gemId);
        if (!gem) {
            return res.status(404).json({ msg: 'Gem not found' });
        }

        // Add notification
        const notification = {
            userId: req.user.id,
            name: req.user.name,
            email: req.user.email,
            mobile: req.user.mobile,
            message
        };

        gem.notifications.push(notification);
        await gem.save();

        res.json({ msg: 'Notification added successfully' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};



// GET CURRENT LOGGED-IN USER
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};












// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ msg: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Generate OTP
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiration = Date.now() + 600000; // 10 minutes

        try {
            await user.save();
        } catch (saveError) {
            console.error('Error saving user with OTP:', saveError);
            return res.status(500).json({ msg: 'Error saving OTP' });
        }

        // Send OTP via email with HTML template
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'LocalGems - Password Reset OTP',
            html: generateEmailTemplate(otp)
        };

        try {
            await transporter.sendMail(mailOptions);
            res.json({ msg: 'OTP sent to your email' });
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            // Revert the OTP save if email fails
            user.otp = undefined;
            user.otpExpiration = undefined;
            await user.save();
            return res.status(500).json({ msg: 'Error sending email. Please try again.' });
        }
    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ msg: 'Internal server error. Please try again.' });
    }
};

// VERIFY OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({
            email,
            otp,
            otpExpiration: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ msg: 'Invalid or expired OTP' });

        // Clear OTP after successful verification
        user.otp = undefined;
        user.otpExpiration = undefined;
        await user.save();

        // Generate reset token for password reset
        const token = crypto.randomBytes(20).toString('hex');
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
        await user.save();

        res.json({ msg: 'OTP verified successfully', token });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() },
        });

        if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();

        res.json({ msg: 'Password reset successful' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
