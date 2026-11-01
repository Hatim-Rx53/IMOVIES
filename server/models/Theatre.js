const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  screenNumber: { type: Number, required: true },
  name: { type: String, required: true },
  totalSeats: { type: Number, default: 60 },
  tiers: [
    {
      tierName: { type: String, enum: ['Standard', 'Premium', 'VIP'], required: true },
      rows: [{ type: String, required: true }],
      cols: { type: Number, required: true, default: 10 },
      priceMultiplier: { type: Number, default: 1.0 }
    }
  ]
});

const theatreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true, index: true },
    address: { type: String, required: true },
    screens: [screenSchema],
    facilities: [{ type: String }],
    isActive: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Theatre', theatreSchema);
