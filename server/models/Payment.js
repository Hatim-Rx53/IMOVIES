const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['card', 'upi', 'netbanking'], required: true },
    transactionId: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: ['success', 'failed', 'refunded'], default: 'success' },
    cardLastFour: { type: String, default: '' },
    upiId: { type: String, default: '' },
    bankName: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
