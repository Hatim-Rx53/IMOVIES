const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true },
    genres: [{ type: String, index: true }],
    languages: [{ type: String, index: true }],
    duration: { type: Number, required: true }, // in minutes
    releaseDate: { type: Date, required: true },
    posterUrl: { type: String, required: true },
    bannerUrl: { type: String, default: '' },
    trailerUrl: { type: String, default: '' },
    rating: { type: Number, default: 8.5 },
    cast: [{ type: String }],
    director: { type: String, default: '' },
    isActive: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
