const Theatre = require('../models/Theatre');

// @desc    Get all theatres
// @route   GET /api/theatres
const getTheatres = async (req, res, next) => {
  try {
    const { city } = req.query;
    const query = { isActive: true };
    if (city && city !== 'All') {
      query.city = { $regex: city, $options: 'i' };
    }

    const theatres = await Theatre.find(query).sort({ name: 1 });
    res.json({ success: true, data: theatres });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single theatre
// @route   GET /api/theatres/:id
const getTheatreById = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }
    res.json({ success: true, data: theatre });
  } catch (err) {
    next(err);
  }
};

// @desc    Create theatre (Admin)
// @route   POST /api/theatres
const createTheatre = async (req, res, next) => {
  try {
    const { name, city, address, screens, facilities } = req.body;

    const defaultScreens = screens || [
      {
        screenNumber: 1,
        name: 'Screen 1 - Dolby Atmos',
        totalSeats: 60,
        tiers: [
          { tierName: 'VIP', rows: ['A'], cols: 10, priceMultiplier: 1.5 },
          { tierName: 'Premium', rows: ['B', 'C', 'D'], cols: 10, priceMultiplier: 1.25 },
          { tierName: 'Standard', rows: ['E', 'F'], cols: 10, priceMultiplier: 1.0 }
        ]
      }
    ];

    const theatre = await Theatre.create({
      name,
      city,
      address,
      screens: defaultScreens,
      facilities: facilities || ['Dolby Atmos', '4K Projection', 'Food Court', 'Wheelchair Access']
    });

    res.status(201).json({ success: true, data: theatre });
  } catch (err) {
    next(err);
  }
};

// @desc    Update theatre (Admin)
// @route   PUT /api/theatres/:id
const updateTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }
    res.json({ success: true, data: theatre });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete theatre (Admin)
// @route   DELETE /api/theatres/:id
const deleteTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }
    theatre.isActive = false;
    await theatre.save();
    res.json({ success: true, message: 'Theatre deactivated successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTheatres, getTheatreById, createTheatre, updateTheatre, deleteTheatre };
