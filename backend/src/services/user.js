const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { hashPassword } = require('../utils/auth');

const updateUserData = async data => {

};

const omitExtraData = data => ({
  firstName: data.firstName,
  lastName: data.lastName,
  email: data.email
});

const updateProfile = async data => {
  // User is trying to change their password
  if (data.newPassword1) {
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
