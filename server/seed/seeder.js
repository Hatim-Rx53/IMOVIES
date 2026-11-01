const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

const { moviesData, theatresData } = require('./seedData');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/imovies_db';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for Seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Theatre.deleteMany({});
    await Show.deleteMany({});
    await Booking.deleteMany({});
    await Payment.deleteMany({});
    await Notification.deleteMany({});

    console.log('Cleared existing data.');

    // 1. Create Default Accounts
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@imovies.com',
      password: 'Admin@123',
      phone: '+91 9876543210',
      role: 'admin'
    });

    const standardUser = await User.create({
      name: 'Hatim Rampurawala',
      email: 'user@imovies.com',
      password: 'User@123',
      phone: '+91 9123456780',
      role: 'user'
    });

    console.log('Created Admin & User accounts.');

    // 2. Insert Movies
    const createdMovies = await Movie.insertMany(moviesData);
    console.log(`Inserted ${createdMovies.length} movies.`);

    // 3. Insert Theatres
    const createdTheatres = await Theatre.insertMany(theatresData);
    console.log(`Inserted ${createdTheatres.length} theatres.`);

    // 4. Generate Shows across the next 3 days
    const timeSlots = [
      { start: '10:30', end: '13:00' },
      { start: '14:15', end: '16:45' },
      { start: '18:00', end: '20:30' },
      { start: '21:30', end: '00:00' }
    ];

    const today = new Date();
    const showsToInsert = [];

    createdTheatres.forEach((theatre) => {
      theatre.screens.forEach((screen) => {
        // Pick 2 movies per screen
        for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
          const showDate = new Date(today);
          showDate.setDate(today.getDate() + dayOffset);
          showDate.setHours(0, 0, 0, 0);

          timeSlots.forEach((slot, slotIdx) => {
            // Alternate movies
            const movie = createdMovies[(theatre.name.length + screen.screenNumber + slotIdx + dayOffset) % createdMovies.length];
            const basePrice = theatre.city === 'Mumbai' ? 250 : 200;

            const seats = [];
            screen.tiers.forEach((tier) => {
              const seatPrice = Math.round(basePrice * (tier.priceMultiplier || 1.0));
              tier.rows.forEach((rowLetter) => {
                for (let c = 1; c <= tier.cols; c++) {
                  seats.push({
                    seatId: `${rowLetter}-${c}`,
                    row: rowLetter,
                    col: c,
                    tier: tier.tierName,
                    price: seatPrice,
                    status: 'available',
                    lockedBy: null,
                    lockedAt: null,
                    bookedBy: null
                  });
                }
              });
            });

            showsToInsert.push({
              movie: movie._id,
              theatre: theatre._id,
              screenNumber: screen.screenNumber,
              date: showDate,
              startTime: slot.start,
              endTime: slot.end,
              basePrice,
              seatLayout: seats
            });
          });
        }
      });
    });

    const createdShows = await Show.insertMany(showsToInsert);
    console.log(`Generated ${createdShows.length} scheduled shows across theatres and dates.`);

    // 5. Create a sample initial booking for the demo user
    const sampleShow = createdShows[0];
    const bookedSeats = [sampleShow.seatLayout[10], sampleShow.seatLayout[11]]; // row B cols 1 & 2
    sampleShow.seatLayout[10].status = 'booked';
    sampleShow.seatLayout[10].bookedBy = standardUser._id;
    sampleShow.seatLayout[11].status = 'booked';
    sampleShow.seatLayout[11].bookedBy = standardUser._id;
    await sampleShow.save();

    const subtotal = bookedSeats[0].price + bookedSeats[1].price;
    const totalAmount = subtotal + 55;

    const sampleBooking = await Booking.create({
      bookingNumber: 'IMV-2026-98124',
      user: standardUser._id,
      show: sampleShow._id,
      movie: sampleShow.movie,
      theatre: sampleShow.theatre,
      screenNumber: sampleShow.screenNumber,
      showDate: sampleShow.date,
      showTime: sampleShow.startTime,
      seats: bookedSeats.map((s) => ({ seatId: s.seatId, tier: s.tier, price: s.price })),
      subtotal,
      convenienceFee: 55,
      totalAmount,
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
      qrCodeData: 'data:image/png;base64,sampleQR'
    });

    await Payment.create({
      booking: sampleBooking._id,
      user: standardUser._id,
      amount: totalAmount,
      paymentMethod: 'card',
      transactionId: 'TXN-INIT-987654',
      status: 'success',
      cardLastFour: '4242'
    });

    await Notification.create({
      user: standardUser._id,
      title: 'Welcome to IMovies!',
      message: 'Explore blockbuster titles and book your premium cinema experience with instant seat locking.',
      type: 'system'
    });

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Failed:', error);
    process.exit(1);
  }
};

seedDatabase();
