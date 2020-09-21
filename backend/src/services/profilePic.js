const fs = require('fs');

const { validatePhoto } = require('../utils/validateUserData');
const User = require('../models/User');

const uploadPhoto = async (photo, user) => {
  if (!validatePhoto(photo)) {
    try {
      fs.unlinkSync(photo.path);
    } finally {
      throw 'Profile picture is not a valid image';
    }
  }

  const rnd = Math.floor(Math.random() * 99999);
  const newFileName = `${user.id}ID${rnd}.${photo.mimetype.split('/')[1]}`;
  fs.renameSync(photo.path, `${__dirname}/../../public/${newFileName}`);
  const res = await User
    .findByIdAndUpdate(user.id, {
      profilePicture: newFileName
    }, {new: true});
  if (res)
    return newFileName;
  else
    return null;
};

module.exports = {
  uploadPhoto
};
