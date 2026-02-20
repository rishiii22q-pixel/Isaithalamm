const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

if (!process.env.MONGODB_URI) {
    console.warn('WARNING: MONGODB_URI is not defined in environment variables.');
}

const app = express();
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const songRoutes = require('./routes/songs');
const playlistRoutes = require('./routes/playlists');

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'https://isaithalamm-haup.vercel.app',
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Database Connection Middleware
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Database connection error in middleware:', error);
        res.status(500).json({ message: 'Database connection error. Please try again later.' });
    }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes);

// Base route
app.get('/', (req, res) => {
    res.send('Isaithalam API is running...');
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
