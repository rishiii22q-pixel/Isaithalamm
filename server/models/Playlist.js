const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    songs: [
        {
            songId: String,
            title: String,
            artist: String,
            image: String,
            url: String,
            duration: Number,
        },
    ],
    coverImage: {
        type: String,
        default: '',
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Playlist', playlistSchema);
