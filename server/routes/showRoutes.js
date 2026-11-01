const express = require('express');
const router = express.Router();
const {
  getShows,
  getShowById,
  createShow,
  deleteShow
} = require('../controllers/showController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(getShows)
  .post(protect, admin, createShow);

router.route('/:id')
  .get(getShowById)
  .delete(protect, admin, deleteShow);

module.exports = router;
