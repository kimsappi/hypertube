const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { hashPassword } = require('../utils/auth');
const { validatePassword,
  validateName,
  validateEmail } = require('../utils/validateUserData');

const updateUserData = async data => {
  console.log(data)
  try {
    const result = await User.findByIdAndUpdate(data.id, data, {
      new: true,
      lean: true
    });
    return result || null;
  } catch(err) {
    throw 'email conflict';
  }
};

const omitExtraData = data => ({
  id: data._id,
  firstName: data.firstName,
  lastName: data.lastName,
  email: data.email,
  language: data.language
});

const updateProfile = async data => {
  if (!validateName(data.firstName) || !validateName(data.lastName) ||
    !validateEmail(data.email))
    throw 'incorrect formatting';
  
  const oldData = await User.findById(data._id, 'password');
  console.log('passwordcomp:', await bcrypt.compare(oldData.password, data.currentPassword))
  if (!await bcrypt.compare(data.currentPassword, oldData.password))
    throw 'password';

  // User is trying to change their password
  if (data.newPassword1 && validatePassword(data.newPassword1)) {
    console.log(`password result ${passwordCorrect}`);
    if (data.newPassword1 !== data.newPassword2)
      throw 'password mismatch';
    else
      return updateUserData({
        ...omitExtraData(data),
        password: await hashPassword(data.newPassword1)
      });
  }
  else
    return updateUserData(omitExtraData(data));
};

module.exports = {
  updateProfile
};
