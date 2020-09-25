const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const config = require('../utils/config');

const userSchema = new mongoose.Schema({
  username: {type: String, unique: true},
  firstName: String,
  lastName: String,
  password: String,
  email: {type: String, unique: true, sparse: true},
  oauth: Array,
  emailVerification: String,
  profilePicture: String,
  language: {type: String, default: 'eng', enum: config.languages},
  mute: {type: Boolean, default: false},

  watched: Object,
  myList: Array,
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema)

module.exports = User;
