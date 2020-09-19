const fs = require('fs');

const { validatePhoto } = require('../utils/validateUserData');
const User = require('../models/User');

const uploadPhoto = async (photo, user) => {
  if (!validatePhoto(photo))
    throw 'Profile picture is not a valid image';

  const newFileName = `${user.id}.${photo.mimetype.split('/')[1]}`;
  fs.renameSync(photo.path, `${__dirname}/../../public/${newFileName}`);
  const res = await User
    .findByIdAndUpdate(user.id, {
      profilePicture: newFileName
    }, {new: true});
  return res;
};

module.exports = {
  uploadPhoto
};
