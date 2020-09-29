const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const movieSchema = new mongoose.Schema({
  dirName: {type: String, unique: true},
  lastViewed: {type: Date, default: Date.now}
});

movieSchema.plugin(uniqueValidator);

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
