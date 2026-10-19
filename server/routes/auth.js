const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const requireAdmin = require('../middleware/auth');

const router = express.Router();

// Slows down password guessing: 10 attempts per 15 minutes per IP.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Try again in 15 minutes.' }
});

// Used so a wrong username takes about as long as a wrong password.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

// POST /api/auth/login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const username = String(req.body.username || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    const user = await User.findOne({ username });
    const valid = await bcrypt.compare(password, user ? user.passwordHash : DUMMY_HASH);

    if (!user || !valid) {
      // Same message for both cases so attackers cannot tell which one failed.
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { sub: String(user._id), username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
    );

    res.json({ token, user: { username: user.username } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed. Try again.' });
  }
});

// GET /api/auth/me  (checks that a stored token is still valid)
router.get('/me', requireAdmin, (req, res) => {
  res.json({ user: { username: req.user.username } });
});

module.exports = router;