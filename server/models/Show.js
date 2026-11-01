const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatId: { type: String, required: true }, // e.g. "A-1"
  row: { type: String, required: true },
  col: { type: Number, required: true },
  tier: { type: String, enum: ['Standard', 'Premium', 'VIP'], default: 'Standard' },
  price: { type: Number, required: true },
  status: { type: String, enum: ['available', 'locked', 'booked'], default: 'available' },
  lockedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  lockedAt: { type: Date, default: null },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});

const showSchema = new mongoose.Schema(
  {
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true, index: true },
    theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true, index: true },
    screenNumber: { type: Number, required: true },
    date: { type: Date, required: true, index: true },
    startTime: { type: String, required: true }, // "14:30"
    endTime: { type: String, required: true },
    basePrice: { type: Number, required: true },
    seatLayout: [seatSchema]
  },
  { timestamps: true }
);

showSchema.index({ movie: 1, date: 1 });
showSchema.index({ theatre: 1, date: 1 });

module.exports = mongoose.model('Show', showSchema);
