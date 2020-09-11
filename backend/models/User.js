const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {type: String, unique: true},
  firstName: String,
  lastName: String,
  password: String,
  email: {type: String, unique: true},
  Oauth: String,
  emailVerification: String,
  profilePicture: String,

  watched: Array,
  myList: Array,
});

export default UserSchema;
