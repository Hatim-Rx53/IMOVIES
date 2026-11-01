const express = require('express');
const router = express.Router();
const {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
} = require('../controllers/movieController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(getMovies)
  .post(protect, admin, upload.single('poster'), createMovie);

router.route('/:id')
  .get(getMovieById)
  .put(protect, admin, upload.single('poster'), updateMovie)
  .delete(protect, admin, deleteMovie);

module.exports = router;
