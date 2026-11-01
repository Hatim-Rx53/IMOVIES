const Show = require('../models/Show');
const Theatre = require('../models/Theatre');

// @desc    Get shows with filters (movie, theatre, date, city)
// @route   GET /api/shows
const getShows = async (req, res, next) => {
  try {
    const { movie, theatre, date, city } = req.query;
    const query = {};

    if (movie) query.movie = movie;
    if (theatre) query.theatre = theatre;

    if (date) {
      const searchDate = new Date(date);
      const startOfDay = new Date(searchDate.setUTCHours(0, 0, 0, 0));
      const endOfDay = new Date(searchDate.setUTCHours(23, 59, 59, 999));
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    let shows = await Show.find(query)
      .populate('movie', 'title posterUrl duration languages genres rating')
      .populate('theatre', 'name city address facilities screens')
      .sort({ date: 1, startTime: 1 });

    if (city && city !== 'All') {
      shows = shows.filter(
        (show) => show.theatre && show.theatre.city.toLowerCase() === city.toLowerCase()
      );
    }

    // Sanitize seatLayout for listing (reduce payload size)
    const sanitizedShows = shows.map((s) => {
      const obj = s.toObject();
      const totalSeats = obj.seatLayout ? obj.seatLayout.length : 0;
      const bookedSeats = obj.seatLayout ? obj.seatLayout.filter((st) => st.status === 'booked').length : 0;
      const availableSeats = totalSeats - bookedSeats;
      delete obj.seatLayout;
      return {
        ...obj,
        totalSeats,
        bookedSeats,
        availableSeats
      };
    });

    res.json({ success: true, data: sanitizedShows });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single show with full seat layout
// @route   GET /api/shows/:id
const getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie')
      .populate('theatre');

    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    res.json({ success: true, data: show });
  } catch (err) {
    next(err);
  }
};

// @desc    Create show & generate seat layout (Admin)
// @route   POST /api/shows
const createShow = async (req, res, next) => {
  try {
    const { movie, theatre, screenNumber, date, startTime, endTime, totalPrice, basePrice } = req.body;

    const theatreDoc = await Theatre.findById(theatre);
    if (!theatreDoc) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    const screen = theatreDoc.screens.find((s) => s.screenNumber === Number(screenNumber)) || theatreDoc.screens[0];
    if (!screen) {
      return res.status(400).json({ success: false, message: 'Invalid screen number' });
    }

    const price = Number(basePrice) || Number(totalPrice) || 200;
    const generatedSeats = [];

    // Generate seats according to screen tiers
    screen.tiers.forEach((tier) => {
      const multiplier = tier.priceMultiplier || 1.0;
      const seatPrice = Math.round(price * multiplier);
      tier.rows.forEach((rowLetter) => {
        for (let c = 1; c <= tier.cols; c++) {
          generatedSeats.push({
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

    const show = await Show.create({
      movie,
      theatre,
      screenNumber: screen.screenNumber,
      date: new Date(date),
      startTime,
      endTime: endTime || '17:00',
      basePrice: price,
      seatLayout: generatedSeats
    });

    res.status(201).json({ success: true, data: show });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete show (Admin)
// @route   DELETE /api/shows/:id
const deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }
    res.json({ success: true, message: 'Show deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getShows, getShowById, createShow, deleteShow };
