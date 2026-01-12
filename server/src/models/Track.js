const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        required: true
    },
    album: String,
    duration: {
        type: Number, // in seconds
        required: true
    },
    genre: [{
        type: String,
        enum: ['local', 'gospel', 'reggae', 'other']
    }],
    releaseDate: {
        type: Date,
        default: Date.now
    },
    youtubeUrl: String,
    audioFile: String, // URL to audio file
    coverArt: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    plays: {
        type: Number,
        default: 0
    },
    bpm: Number,
    key: String,
    tags: [String],
    isFeatured: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Track', trackSchema);