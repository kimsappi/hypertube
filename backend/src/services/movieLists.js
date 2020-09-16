const User = require('../models/User');

const addToList = async (magnet, user, myList) => {
  await User.findByIdAndUpdate(user.id, {
    $addToSet: {myList: magnet}
  });
};

module.exports = {
  addToList
};
