const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  name: String,
  lastViewed: Date
});

export default MovieSchema;
