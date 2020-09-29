const bcrypt = require('bcryptjs');

const { validateRegistrationData, validatePassword } = require('../utils/validateUserData');
const { hashPassword, generateEmailVerification } = require('../utils/auth');
const User = require('../models/User');

const register = async data => {
  if (!validateRegistrationData(data))
    throw 'Invalid data';

  const emailVerification = await generateEmailVerification(data);

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
    _id: user._id,
    email: data.email,
    emailVerification,
    username: data.username
  };
};

const login = async data => {
  const user = await User.findOne({
    username: data.username
  }, 'username emailVerification profilePicture mute password watched myList language');

  if (!user || !await bcrypt.compare(data.password, user.password))
    throw 'invalid username or password';
  else if (user.emailVerification)
    throw 'email not verified';
  return {
    username: user.username,
    profilePicture: user.profilePicture,
	id: user._id,
	mute: user.mute,
	watched: user.watched,
	myList: user.myList,
	language: user.language
  };
};

const resetPassword = async email => {
  const user = await User.findOne({email: email});

  const emailVerification = await generateEmailVerification(user);
  await User.findByIdAndUpdate(user._id, {
    password: null,
    emailVerification: emailVerification
  });
  
  return {...user, emailVerification};
};

const setNewPassword = async (id, data) => {
  if (!validatePassword(data.password))
    throw 'invalid password';
  const user = await User.findById(id);
  if (user.emailVerification !== data.code)
    throw 'invalid verification code';
  const updated = await User.findByIdAndUpdate(id, {
    emailVerification: null,
    password: await hashPassword(data.password)
  }, {new: true});
  return updated;
};

const confirmEmail = async req => {
  const id = req.params.id;
  const code = req.query.code;

  const user = await User.findOneAndUpdate({
    _id: id,
    emailVerification: code
  }, {emailVerification: null});

  return user;
};

// const updateUserData = async (id, data) => {
// 	if (!validatePassword(data.password))
//     	throw 'invalid password';
// };

module.exports = {
  register,
  login,
  resetPassword,
  setNewPassword,
  confirmEmail,
//   updateUserData
}
