const mongoose = require('mongoose');

const bookedSeatSchema = new mongoose.Schema({
  seatId: { type: String, required: true },
  tier: { type: String, required: true },
  price: { type: Number, required: true }
});

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: { type: String, required: true, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true, index: true },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true },
    screenNumber: { type: Number, required: true },
    showDate: { type: Date, required: true },
    showTime: { type: String, required: true },
    seats: [bookedSeatSchema],
    subtotal: { type: Number, required: true },
    convenienceFee: { type: Number, required: true, default: 30 },
    totalAmount: { type: Number, required: true },
    bookingStatus: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed', index: true },
    paymentStatus: { type: String, enum: ['paid', 'refunded'], default: 'paid' },
    qrCodeData: { type: String, default: '' },
    cancellationReason: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
