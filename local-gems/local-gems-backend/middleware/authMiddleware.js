const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify token and get user info
const auth = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ msg: 'No token, access denied' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied: Admins only' });
    }
    next();
};

// Middleware to check if user is gem
const isGem = (req, res, next) => {
    if (req.user.role !== 'gem') {
        return res.status(403).json({ msg: 'Access denied: Gems only' });
    }
    next();
};

module.exports = { auth, isAdmin, isGem };
