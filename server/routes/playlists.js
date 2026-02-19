const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const { protect } = require('../middleware/auth');

// @desc    Get all playlists for a user
// @route   GET /api/playlists
router.get('/', protect, async (req, res) => {
    try {
        const playlists = await Playlist.find({ owner: req.user._id });
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create a new playlist
// @route   POST /api/playlists
router.post('/', protect, async (req, res) => {
    const { name, isPublic } = req.body;

    try {
        const playlist = await Playlist.create({
            name,
            owner: req.user._id,
            isPublic
        });
        res.status(201).json(playlist);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get playlist by ID
// @route   GET /api/playlists/:id
router.get('/:id', protect, async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);

        if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

        // Check ownership or if public
        if (playlist.owner.toString() !== req.user._id.toString() && !playlist.isPublic) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(playlist);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Add song to playlist
// @route   POST /api/playlists/:id/songs
router.post('/:id/songs', protect, async (req, res) => {
    const { songId, title, artist, image, duration, url } = req.body;

    try {
        const playlist = await Playlist.findById(req.params.id);

        if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

        if (playlist.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Check if song already exists
        const songExists = playlist.songs.find(song => song.songId === songId);
        if (songExists) {
            return res.status(400).json({ message: 'Song already in playlist' });
        }

        playlist.songs.push({ songId, title, artist, image, duration, url });
        await playlist.save();
        res.json(playlist);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Remove song from playlist
// @route   DELETE /api/playlists/:id/songs/:songId
router.delete('/:id/songs/:songId', protect, async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);

        if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

        if (playlist.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        playlist.songs = playlist.songs.filter(
            song => song.songId !== req.params.songId
        );

        await playlist.save();
        res.json(playlist);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
