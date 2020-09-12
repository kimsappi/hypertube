const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  name: String,
  lastViewed: Date
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
