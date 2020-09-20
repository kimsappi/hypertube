const mongoose = require('mongoose');

const scrapedMovieSchema = new mongoose.Schema({
  imdbId: String,
  title: String,
  year: Number,
  runtime: Number,
  magnet: String,
  poster: String,
  percentage: Number,
  votes: Number
});

const ScrapedMovie = mongoose.model('ScrapedMovie', scrapedMovieSchema);

module.exports = ScrapedMovie;
