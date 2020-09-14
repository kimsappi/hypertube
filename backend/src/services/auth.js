const bcrypt = require('bcryptjs');

const { validateRegistrationData } = require('../utils/validateUserData');
const { hashPassword } = require('../utils/auth');
const User = require('../models/User');

const register = async data => {
  if (!validateRegistrationData(data))
    throw 'Invalid data';

  const emailVerification = await bcrypt.hash(
    data.username + new Date() + data.email,
    2
  );

  const user = new User({
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    password: await hashPassword(data.password),
    email: data.email,
    emailVerification
  });

  const result = await user.save();

  return {
    result,
    email: data.email,
    emailVerification
  };
};

const login = async data => {
  const user = await User.findOne({
    username: data.username
  }, 'username emailVerification profilePicture password');

  if (!user || !await bcrypt.compare(data.password, user.password))
    throw 'invalid username or password';
  else if (user.emailVerification)
    throw 'email not verified';
  const {password, emailVerification, ...ret} = user;
  return ret;
};

module.exports = {
  register,
  login
}
