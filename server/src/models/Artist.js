const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    bio: String,
    avatar: String,
    coverImage: String,
    genres: [String],
    socialLinks: {
        facebook: String,
        youtube: String,
        spotify: String,
        soundcloud: String
    },
    equipment: [String],
    tracks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Track'
    }],
    collaborations: [{
        artist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Artist'
        },
        project: String
    }],
    isFeatured: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Artist', artistSchema);