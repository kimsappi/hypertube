const User = require('../models/User');

const Lists = {
  myList: 1,
  watched: 2
};

const addToList = async (id, user, listType) => {
  const valueToAdd = listType === Lists.myList ?
    {myList: id} :
    {watched: id};

  await User.findByIdAndUpdate(user.id, {
    $addToSet: valueToAdd
  });
};

module.exports = {
  addToList,
  Lists
};
