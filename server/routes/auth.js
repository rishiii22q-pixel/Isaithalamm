const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            phone,
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                avatar: user.avatar,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Google OAuth
// @route   POST /api/auth/google
router.post('/google', async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture, sub: googleId } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (user) {
            // Update existing user with Google ID and avatar if missing
            if (!user.googleId) user.googleId = googleId;
            if (!user.avatar) user.avatar = picture;
            await user.save();
        } else {
            // Create new user
            user = await User.create({
                name,
                email,
                googleId,
                avatar: picture,
                password: Math.random().toString(36).slice(-8), // Dummy password
            });
        }

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(500).json({ message: 'Google authentication failed' });
    }
});

// @desc    Get user data
// @route   GET /api/auth/me
router.get('/me', require('../middleware/auth').protect, async (req, res) => {
    res.status(200).json(req.user);
});

// @desc    Like a song
// @route   POST /api/auth/like
router.post('/like', require('../middleware/auth').protect, async (req, res) => {
    try {
        const { songId, title, artist, image, url, duration } = req.body;

        const user = await User.findById(req.user.id);

        // Check if already liked
        if (user.likedSongs.find(song => song.songId === songId)) {
            return res.status(400).json({ message: 'Song already liked' });
        }

        user.likedSongs.push({ songId, title, artist, image, url, duration });
        await user.save();

        res.json(user.likedSongs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Unlike a song
// @route   DELETE /api/auth/like/:songId
router.delete('/like/:songId', require('../middleware/auth').protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        user.likedSongs = user.likedSongs.filter(song => song.songId !== req.params.songId);
        await user.save();

        res.json(user.likedSongs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
