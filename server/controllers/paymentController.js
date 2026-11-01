const Payment = require('../models/Payment');

// @desc    Get payment receipt for booking
// @route   GET /api/payments/booking/:bookingId
const getPaymentByBooking = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ booking: req.params.bookingId })
      .populate('user', 'name email phone')
      .populate('booking');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    if (String(payment.user._id) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.json({ success: true, data: payment });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPaymentByBooking };
