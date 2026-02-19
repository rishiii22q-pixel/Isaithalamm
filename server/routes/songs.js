const express = require('express');
const router = express.Router();
const ytSearch = require('yt-search');

// Helper to format YouTube result
const formatVideo = (video) => {
    // yt-search returns different structures for search vs details
    // simplify to common interface
    return {
        id: video.videoId || video.id,
        title: video.title,
        artist: video.author?.name || video.author?.name || 'Unknown Artist',
        image: video.thumbnail || video.image,
        url: video.url,
        duration: video.duration?.timestamp || video.timestamp,
        durationSec: video.duration?.seconds || video.seconds || 0
    };
};

// @desc    Get trending songs (Simulated by search)
// @route   GET /api/songs/trending
router.get('/trending', async (req, res) => {
    try {
        const queries = ['Top 50 Tamil Songs', 'Global Top 50', 'English Hits 2024', 'Trending Music India'];
        const randomQuery = queries[Math.floor(Math.random() * queries.length)];

        const r = await ytSearch(randomQuery);
        const songs = r.videos.slice(0, 20).map(formatVideo);

        res.json(songs);
    } catch (error) {
        console.error('Error fetching trending songs:', error.message);
        res.status(500).json({ message: 'Failed to fetch trending songs' });
    }
});

// @desc    Search songs
// @route   GET /api/songs/search?q=query
router.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });

    try {
        const r = await ytSearch(query);
        const songs = r.videos.slice(0, 25).map(formatVideo);
        res.json(songs);
    } catch (error) {
        console.error('Error searching songs:', error.message);
        res.status(500).json({ message: 'Failed to search songs' });
    }
});

// @desc    Get song details
// @route   GET /api/songs/:id
router.get('/:id', async (req, res) => {
    try {
        const videoId = req.params.id;
        const video = await ytSearch({ videoId: videoId });

        if (!video) return res.status(404).json({ message: 'Song not found' });

        res.json({
            id: video.videoId,
            title: video.title,
            artist: video.author.name,
            image: video.thumbnail,
            url: video.url,
            duration: video.duration.timestamp,
            durationSec: video.duration.seconds,
            description: video.description
        });
    } catch (error) {
        console.error('Error fetching song details:', error.message);
        res.status(500).json({ message: 'Failed to fetch song details' });
    }
});

module.exports = router;
