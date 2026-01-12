const Booking = require('../models/Booking');
const User = require('../models/User');
const { sendBookingConfirmationEmail } = require('../utils/emailService');

// Create booking
exports.createBooking = async (req, res) => {
    try {
        const { userId, packageType, date, timeSlot, notes, equipmentRequested } = req.body;
        
        // Check if time slot is available
        const existingBooking = await Booking.findOne({
            date: new Date(date),
            timeSlot,
            status: { $in: ['pending', 'confirmed'] }
        });
        
        if (existingBooking) {
            return res.status(400).json({ message: 'This time slot is already booked' });
        }
        
        // Calculate price based on package
        const packagePrices = {
            mixing: 150,
            mastering: 100,
            production: 300,
            recording: 200,
            consultation: 80
        };
        
        const totalPrice = packagePrices[packageType] || 150;
        
        const booking = new Booking({
            user: userId,
            packageType,
            date: new Date(date),
            timeSlot,
            notes,
            equipmentRequested,
            totalPrice,
            status: 'pending'
        });
        
        await booking.save();
        
        // Add booking to user's bookings
        await User.findByIdAndUpdate(userId, {
            $push: { bookings: booking._id }
        });
        
        // Send confirmation email
        const user = await User.findById(userId);
        await sendBookingConfirmationEmail(user.email, booking);
        
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get user bookings
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.userId })
            .populate('user', 'name email')
            .sort('-createdAt');
        
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all bookings (Admin only)
exports.getAllBookings = async (req, res) => {
    try {
        const { status, date, page = 1, limit = 20 } = req.query;
        
        let query = {};
        if (status) query.status = status;
        if (date) query.date = { $gte: new Date(date) };
        
        const bookings = await Booking.find(query)
            .populate('user', 'name email phone')
            .sort('-date')
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));
        
        const total = await Booking.countDocuments(query);
        
        res.json({
            bookings,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update booking status (Admin only)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        const booking = await Booking.findById(req.params.id)
            .populate('user', 'email name');
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        booking.status = status;
        await booking.save();
        
        // Send status update email
        await sendBookingStatusEmail(booking.user.email, booking);
        
        res.json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get available time slots
exports.getAvailableSlots = async (req, res) => {
    try {
        const { date } = req.query;
        
        if (!date) {
            return res.status(400).json({ message: 'Date is required' });
        }
        
        const selectedDate = new Date(date);
        const dayOfWeek = selectedDate.getDay();
        
        // Studio hours
        const studioHours = {
            weekdays: ['9:00', '11:00', '14:00', '16:00', '19:00'],
            saturdays: ['12:00', '14:00', '16:00', '18:00'],
            closed: [0] // Sunday
        };
        
        // Get booked slots for the day
        const bookings = await Booking.find({
            date: {
                $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
                $lt: new Date(selectedDate.setHours(23, 59, 59, 999))
            },
            status: { $in: ['pending', 'confirmed'] }
        });
        
        const bookedSlots = bookings.map(b => b.timeSlot);
        
        // Determine available slots based on day
        let availableSlots = [];
        if (dayOfWeek === 0) {
            // Sunday - closed
            availableSlots = [];
        } else if (dayOfWeek === 6) {
            // Saturday
            availableSlots = studioHours.saturdays.filter(slot => !bookedSlots.includes(slot));
        } else {
            // Weekdays
            availableSlots = studioHours.weekdays.filter(slot => !bookedSlots.includes(slot));
        }
        
        res.json({ date: selectedDate, availableSlots });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};