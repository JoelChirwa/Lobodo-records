const Track = require('../models/Track');
const Artist = require('../models/Artist');
const cloudinary = require('../config/cloudinary');

// Get all tracks with filtering
exports.getAllTracks = async (req, res) => {
    try {
        const { genre, artist, featured, sort = '-createdAt', limit = 20, page = 1 } = req.query;
        
        let query = {};
        
        if (genre) query.genre = { $in: genre.split(',') };
        if (artist) query.artist = artist;
        if (featured) query.isFeatured = featured === 'true';
        
        const tracks = await Track.find(query)
            .populate('artist', 'name avatar')
            .sort(sort)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));
        
        const total = await Track.countDocuments(query);
        
        res.json({
            tracks,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single track
exports.getTrack = async (req, res) => {
    try {
        const track = await Track.findById(req.params.id)
            .populate('artist', 'name bio avatar genres');
        
        if (!track) {
            return res.status(404).json({ message: 'Track not found' });
        }
        
        // Increment play count
        track.plays += 1;
        await track.save();
        
        res.json(track);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create track (Admin only)
exports.createTrack = async (req, res) => {
    try {
        const { title, artist, youtubeUrl, ...trackData } = req.body;
        
        // Handle audio file upload to Cloudinary
        let audioFileUrl = '';
        if (req.files && req.files.audio) {
            const audioUpload = await cloudinary.uploader.upload(req.files.audio.tempFilePath, {
                resource_type: 'video', // Cloudinary uses 'video' for audio files
                folder: 'lobodo/audio',
                format: 'mp3'
            });
            audioFileUrl = audioUpload.secure_url;
        }
        
        // Handle cover art upload
        let coverArtUrl = '';
        if (req.files && req.files.coverArt) {
            const imageUpload = await cloudinary.uploader.upload(req.files.coverArt.tempFilePath, {
                folder: 'lobodo/covers',
                transformation: [{ width: 800, height: 800, crop: 'fill' }]
            });
            coverArtUrl = imageUpload.secure_url;
        }
        
        const track = new Track({
            title,
            artist,
            youtubeUrl,
            audioFile: audioFileUrl,
            coverArt: coverArtUrl,
            ...trackData
        });
        
        await track.save();
        
        // Add track to artist's tracks array
        await Artist.findByIdAndUpdate(artist, {
            $push: { tracks: track._id }
        });
        
        res.status(201).json(track);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update track
exports.updateTrack = async (req, res) => {
    try {
        const track = await Track.findById(req.params.id);
        
        if (!track) {
            return res.status(404).json({ message: 'Track not found' });
        }
        
        // Handle file uploads if present
        if (req.files && req.files.audio) {
            const audioUpload = await cloudinary.uploader.upload(req.files.audio.tempFilePath, {
                resource_type: 'video',
                folder: 'lobodo/audio',
                format: 'mp3'
            });
            track.audioFile = audioUpload.secure_url;
        }
        
        if (req.files && req.files.coverArt) {
            const imageUpload = await cloudinary.uploader.upload(req.files.coverArt.tempFilePath, {
                folder: 'lobodo/covers',
                transformation: [{ width: 800, height: 800, crop: 'fill' }]
            });
            track.coverArt = imageUpload.secure_url;
        }
        
        // Update other fields
        Object.keys(req.body).forEach(key => {
            if (key !== 'audio' && key !== 'coverArt') {
                track[key] = req.body[key];
            }
        });
        
        await track.save();
        res.json(track);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete track
exports.deleteTrack = async (req, res) => {
    try {
        const track = await Track.findById(req.params.id);
        
        if (!track) {
            return res.status(404).json({ message: 'Track not found' });
        }
        
        // Remove track from artist's tracks array
        await Artist.findByIdAndUpdate(track.artist, {
            $pull: { tracks: track._id }
        });
        
        await track.remove();
        res.json({ message: 'Track deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Like/unlike track
exports.toggleLike = async (req, res) => {
    try {
        const track = await Track.findById(req.params.id);
        
        if (!track) {
            return res.status(404).json({ message: 'Track not found' });
        }
        
        track.likes += req.body.action === 'like' ? 1 : -1;
        await track.save();
        
        res.json({ likes: track.likes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};