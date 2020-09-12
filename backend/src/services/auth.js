const bcrypt = require('bcrypt');

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
    password: await(hashPassword(data.password)),
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

module.exports = {
  register,
}
