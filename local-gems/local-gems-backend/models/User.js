const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    retypepassword: { type: String },
    role: { type: String, enum: ['user', 'gem', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    idProof: { type: mongoose.Schema.Types.Mixed, required: false },    // Use Mixed type to handle various input types
    mobile: { type: String },
    socialLink: { type: String },
    location: { type: String },
    talent: { type: String },
    category: { type: String },
    experience: { type: String },
    notifications: [{
        userId: { type: mongoose.Schema.Types.ObjectId },
        name: { type: String },
        email: { type: String },
        mobile: { type: String },
        message: { type: String },
        bookingStatus: { type: String, enum: ['pending', 'accepted', 'declined'] },
        date: { type: Date, default: Date.now }
    }],
    messages: [{
        userId: { type: mongoose.Schema.Types.ObjectId },
        gemId: { type: mongoose.Schema.Types.ObjectId },
        content: { type: String },
        sender: { type: String, enum: ['user', 'gem'] },
        createdAt: { type: Date, default: Date.now }
    }],
    reviews: [{
        reviewer: { type: mongoose.Schema.Types.ObjectId },
        reviewerName: { type: String },
        rating: { type: Number },
        comment: { type: String },
        date: { type: Date, default: Date.now }
    }],
    likes: [{
        user: { type: mongoose.Schema.Types.ObjectId },
        date: { type: Date, default: Date.now }
    }],
    otp: { type: String },
    otpExpiration: { type: Date },
    resetToken: { type: String },
    resetTokenExpiration: { type: Date }
});

module.exports = mongoose.model('User', userSchema);
