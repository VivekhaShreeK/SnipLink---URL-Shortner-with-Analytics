const jwt = require('jsonwebtoken');
const https = require('https');
const { Op } = require('sequelize');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRES_IN, GOOGLE_CLIENT_ID } = require('../config/env');

const verifyGoogleToken = (credential) => {
  return new Promise((resolve, reject) => {
    if (typeof fetch === 'function') {
      fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Token verification failed');
          }
          return res.json();
        })
        .then((data) => resolve(data))
        .catch((err) => reject(err));
      return;
    }

    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`Token verification failed with status ${res.statusCode}`));
          return;
        }
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

/**
 * Generate JWT token for a user.
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  res.json({
    success: true,
    data: { user: req.user.toJSON() },
  });
};

/**
 * POST /api/auth/google
 */
const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required.',
      });
    }

    if (!GOOGLE_CLIENT_ID) {
      return res.status(500).json({
        success: false,
        message: 'Google authentication is not configured on the server.',
      });
    }

    // Verify the Google ID token
    let payload;
    try {
      payload = await verifyGoogleToken(credential);
    } catch (verifyError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Google credential.',
      });
    }

    const { sub: googleId, email, name, email_verified, aud } = payload;

    // Verify audience
    if (aud !== GOOGLE_CLIENT_ID) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Google client ID or audience.',
      });
    }

    const isEmailVerified = email_verified === true || email_verified === 'true';
    if (!isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Google email is not verified.',
      });
    }

    // Find existing user by googleId or email
    let user = await User.findOne({
      where: {
        [Op.or]: [{ googleId }, { email }],
      },
    });

    if (user) {
      // Link Google account if user exists by email but hasn't linked Google yet
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Create a new user (no password needed for Google users)
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        googleId,
      });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Google login successful.',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, googleLogin };
