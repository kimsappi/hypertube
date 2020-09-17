const User = require('../models/User');

const addToList = async (id, user, listType) => {
  await User.findByIdAndUpdate(user.id, {
    $addToSet: {myList: id}
  });
};

module.exports = {
  addToList
};
