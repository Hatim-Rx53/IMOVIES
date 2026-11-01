const Booking = require('../models/Booking');
const Show = require('../models/Show');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const { generateQRCode } = require('../utils/qrGenerator');
const { notifySeatsBooked, notifySeatsReleased } = require('../config/socket');

// @desc    Create new booking with payment processing
// @route   POST /api/bookings
const createBooking = async (req, res, next) => {
  try {
    const {
      showId,
      seatIds,
      paymentMethod = 'card',
      cardDetails,
      upiId,
      bankName,
      simulateFailure = false
    } = req.body;

    if (!showId || !seatIds || !seatIds.length) {
      return res.status(400).json({ success: false, message: 'Show and seats are required' });
    }

    // 1. Failure simulation trigger
    if (simulateFailure) {
      return res.status(400).json({
        success: false,
        message: 'Payment was declined by bank simulator. Please try another payment method.'
      });
    }

    // 2. Fetch show and verify seat availability
    const show = await Show.findById(showId).populate('movie').populate('theatre');
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    const seatsToBook = [];
    const unavailableSeats = [];

    seatIds.forEach((id) => {
      const seat = show.seatLayout.find((s) => s.seatId === id);
      if (!seat) {
        unavailableSeats.push(id);
      } else if (seat.status === 'booked') {
        unavailableSeats.push(id);
      } else if (seat.status === 'locked' && seat.lockedBy && String(seat.lockedBy) !== String(req.user._id)) {
        unavailableSeats.push(id);
      } else {
        seatsToBook.push(seat);
      }
    });

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Seats ${unavailableSeats.join(', ')} are no longer available.`
      });
    }

    // 3. Calculate pricing
    const subtotal = seatsToBook.reduce((acc, curr) => acc + curr.price, 0);
    const convenienceFee = Math.round(subtotal * 0.05) + 30; // 5% + ₹30 fee
    const totalAmount = subtotal + convenienceFee;

    // 4. Update seats in show to 'booked'
    seatIds.forEach((id) => {
      const seat = show.seatLayout.find((s) => s.seatId === id);
      if (seat) {
        seat.status = 'booked';
        seat.bookedBy = req.user._id;
        seat.lockedBy = null;
        seat.lockedAt = null;
      }
    });
    await show.save();

    // 5. Generate unique booking number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingNumber = `IMV-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    // 6. Generate QR Code
    const qrDataPayload = JSON.stringify({
      bookingNumber,
      movie: show.movie.title,
      theatre: show.theatre.name,
      seats: seatIds,
      date: show.date,
      time: show.startTime
    });
    const qrCodeData = await generateQRCode(qrDataPayload);

    // 7. Create Booking
    const booking = await Booking.create({
      bookingNumber,
      user: req.user._id,
      show: show._id,
      movie: show.movie._id,
      theatre: show.theatre._id,
      screenNumber: show.screenNumber,
      showDate: show.date,
      showTime: show.startTime,
      seats: seatsToBook.map((s) => ({
        seatId: s.seatId,
        tier: s.tier,
        price: s.price
      })),
      subtotal,
      convenienceFee,
      totalAmount,
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
      qrCodeData
    });

    // 8. Create Payment Record
    const transactionId = `TXN-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`;
    await Payment.create({
      booking: booking._id,
      user: req.user._id,
      amount: totalAmount,
      paymentMethod,
      transactionId,
      status: 'success',
      cardLastFour: cardDetails && cardDetails.cardNumber ? cardDetails.cardNumber.slice(-4) : '4242',
      upiId: upiId || '',
      bankName: bankName || ''
    });

    // 9. Send In-App Notification
    await Notification.create({
      user: req.user._id,
      title: 'Booking Confirmed!',
      message: `Your tickets for "${show.movie.title}" (${seatIds.join(', ')}) at ${show.theatre.name} have been confirmed. Booking ID: ${bookingNumber}.`,
      type: 'booking'
    });

    // 10. Broadcast real-time seat update via Socket.io
    const io = req.app.get('io');
    notifySeatsBooked(io, showId, seatIds);

    const populatedBooking = await Booking.findById(booking._id)
      .populate('movie')
      .populate('theatre');

    res.status(201).json({
      success: true,
      data: populatedBooking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my
const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie')
      .populate('theatre')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movie')
      .populate('theatre')
      .populate('show');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (String(booking.user) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel booking & refund
// @route   POST /api/bookings/:id/cancel
const cancelBooking = async (req, res, next) => {
  try {
    const { reason = 'User requested cancellation' } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (String(booking.user) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    booking.cancellationReason = reason;
    await booking.save();

    // Release seats in show
    const show = await Show.findById(booking.show);
    const releasedSeatIds = [];
    if (show) {
      booking.seats.forEach((bSeat) => {
        const seat = show.seatLayout.find((s) => s.seatId === bSeat.seatId);
        if (seat) {
          seat.status = 'available';
          seat.bookedBy = null;
          seat.lockedBy = null;
          seat.lockedAt = null;
          releasedSeatIds.push(seat.seatId);
        }
      });
      await show.save();

      // Broadcast released seats
      const io = req.app.get('io');
      notifySeatsReleased(io, show._id.toString(), releasedSeatIds);
    }

    // Update payment record
    await Payment.findOneAndUpdate(
      { booking: booking._id },
      { status: 'refunded' }
    );

    // Notify user
    await Notification.create({
      user: booking.user,
      title: 'Booking Cancelled',
      message: `Your booking ${booking.bookingNumber} has been cancelled. Refund of ₹${booking.totalAmount} will be credited to your account.`,
      type: 'cancellation'
    });

    res.json({ success: true, message: 'Booking cancelled and refund processed successfully', data: booking });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings/admin/all
const getAllBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    const query = {};
    if (status && status !== 'All') {
      query.bookingStatus = status;
    }

    const count = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('movie', 'title')
      .populate('theatre', 'name city')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        pages: Math.ceil(count / Number(limit))
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookings
};
