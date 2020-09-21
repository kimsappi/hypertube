const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { hashPassword } = require('../utils/auth');
const { validatePassword,
  validateName,
  validateEmail } = require('../utils/validateUserData');

const updateUserData = async data => {
  const result = await User.findByIdAndUpdate(data.id, data, {
    new: true,
    lean: true
  });
  return result || null;
};

const omitExtraData = data => ({
  id: data._id,
  firstName: data.firstName,
  lastName: data.lastName,
  email: data.email
});

const updateProfile = async data => {
  if (!validateName(data.firstName) || !validateName(data.lastName) ||
    !validateEmail(data.email))
    throw 'Data is incorrectly formatted';
  // User is trying to change their password
  if (data.newPassword1 && validatePassword(data.newPassword1)) {
    const oldData = await User.findById(data._id, 'password');
    if (!await bcrypt.compare(oldData.password, data.currentPassword) ||
      data.newPassword1 !== data.newPassword2)
      return null;
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
