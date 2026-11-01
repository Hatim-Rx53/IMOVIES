const express = require('express');
const router = express.Router();
const { getPaymentByBooking } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.get('/booking/:bookingId', protect, getPaymentByBooking);

module.exports = router;
