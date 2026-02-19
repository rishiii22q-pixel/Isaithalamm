const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        minlength: 6,
        select: false,
    },
    phone: {
        type: String,
        trim: true,
    },
    googleId: {
        type: String,
        sparse: true,
    },
    avatar: {
        type: String,
        default: '',
    },
    likedSongs: [
        {
            songId: String,
            title: String,
            artist: String,
            image: String,
            url: String,
            duration: Number,
            addedAt: { type: Date, default: Date.now },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before save
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
