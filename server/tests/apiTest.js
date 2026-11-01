const assert = require('assert');
const http = require('http');

// Small assert-based test runner against the running server
// Can also test controller logic or start temporary listener
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const Booking = require('../models/Booking');

async function runSelfChecks() {
  console.log('Running backend self-checks...');
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/imovies_db';
  await mongoose.connect(mongoUri);

  // 1. Verify Users & Password Hashing
  const admin = await User.findOne({ email: 'admin@imovies.com' });
  assert(admin, 'Admin account should exist');
  assert.strictEqual(admin.role, 'admin');
  const isMatch = await admin.matchPassword('Admin@123');
  assert(isMatch, 'Password comparison should match Admin@123');
  console.log('✔ Auth & Password Hashing check passed');

  // 2. Verify Movies
  const moviesCount = await Movie.countDocuments({ isActive: true });
  assert(moviesCount >= 8, `Expected at least 8 movies, found ${moviesCount}`);
  const sciFiMovies = await Movie.find({ genres: 'Sci-Fi' });
  assert(sciFiMovies.length > 0, 'Should find Sci-Fi movies');
  console.log('✔ Movie queries & genre filter check passed');

  // 3. Verify Shows & Seat Layouts
  const show = await Show.findOne().populate('movie').populate('theatre');
  assert(show, 'At least one show must exist');
  assert(show.seatLayout.length > 0, 'Show should have generated seat layout');
  assert(show.seatLayout[0].seatId, 'Seat must have seatId');
  assert(show.seatLayout[0].price > 0, 'Seat must have calculated price');
  console.log('✔ Shows and tiered seat layouts check passed');

  // 4. Verify Bookings
  const booking = await Booking.findOne();
  assert(booking, 'Sample booking should exist');
  assert(booking.seats.length > 0, 'Booking should contain booked seats');
  assert(booking.totalAmount > 0, 'Booking must have total amount');
  console.log('✔ Booking schema & relations check passed');

  await mongoose.disconnect();
  console.log('All backend self-checks PASSED successfully!');
}

runSelfChecks().catch((err) => {
  console.error('Self-check error:', err);
  process.exit(1);
});
