const Movie = require('../models/Movie');

// @desc    Get all movies with filters & search
// @route   GET /api/movies
const getMovies = async (req, res, next) => {
  try {
    const { search, genre, language, sort, page = 1, limit = 20 } = req.query;

    const query = { isActive: true };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (genre && genre !== 'All') {
      query.genres = { $in: [genre] };
    }

    if (language && language !== 'All') {
      query.languages = { $in: [language] };
    }

    let sortOption = { releaseDate: -1 };
    if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'title') {
      sortOption = { title: 1 };
    } else if (sort === 'oldest') {
      sortOption = { releaseDate: 1 };
    }

    const count = await Movie.countDocuments(query);
    const movies = await Movie.find(query)
      .sort(sortOption)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json({
      success: true,
      data: movies,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        pages: Math.ceil(count / Number(limit))
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.json({ success: true, data: movie });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new movie (Admin)
// @route   POST /api/movies
const createMovie = async (req, res, next) => {
  try {
    let posterUrl = req.body.posterUrl;
    if (req.file) {
      posterUrl = `/uploads/${req.file.filename}`;
    }

    const {
      title,
      description,
      genres,
      languages,
      duration,
      releaseDate,
      bannerUrl,
      trailerUrl,
      rating,
      cast,
      director
    } = req.body;

    const parsedGenres = Array.isArray(genres) ? genres : (genres ? genres.split(',').map((s) => s.trim()) : []);
    const parsedLanguages = Array.isArray(languages) ? languages : (languages ? languages.split(',').map((s) => s.trim()) : []);
    const parsedCast = Array.isArray(cast) ? cast : (cast ? cast.split(',').map((s) => s.trim()) : []);

    const movie = await Movie.create({
      title,
      description,
      genres: parsedGenres,
      languages: parsedLanguages,
      duration: Number(duration) || 120,
      releaseDate: releaseDate || new Date(),
      posterUrl: posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
      bannerUrl: bannerUrl || '',
      trailerUrl: trailerUrl || '',
      rating: Number(rating) || 8.0,
      cast: parsedCast,
      director: director || ''
    });

    res.status(201).json({ success: true, data: movie });
  } catch (err) {
    next(err);
  }
};

// @desc    Update movie (Admin)
// @route   PUT /api/movies/:id
const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    if (req.file) {
      req.body.posterUrl = `/uploads/${req.file.filename}`;
    }

    if (typeof req.body.genres === 'string') {
      req.body.genres = req.body.genres.split(',').map((s) => s.trim());
    }
    if (typeof req.body.languages === 'string') {
      req.body.languages = req.body.languages.split(',').map((s) => s.trim());
    }
    if (typeof req.body.cast === 'string') {
      req.body.cast = req.body.cast.split(',').map((s) => s.trim());
    }

    const updated = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete movie (Admin)
// @route   DELETE /api/movies/:id
const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    movie.isActive = false;
    await movie.save();
    res.json({ success: true, message: 'Movie removed successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMovies, getMovieById, createMovie, updateMovie, deleteMovie };
