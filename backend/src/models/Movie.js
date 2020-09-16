const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const movieSchema = new mongoose.Schema({
  magnet: {type: String, unique: true},
  lastViewed: {type: Date, default: Date.now},
  fullyDownloaded: {type: Boolean, default: false}
});

movieSchema.plugin(uniqueValidator);

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
