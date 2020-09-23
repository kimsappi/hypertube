const User = require('../models/User');

const Lists = {
  myList: 1,
  watched: 2
};

const addToList = async (id, user, listType) => {
  const valueToAdd = listType === Lists.myList ?
    {myList: id} :
    {watched: id};

  const res = await User
    .findByIdAndUpdate(user.id, {
      $addToSet: valueToAdd
    })
    .lean();
  if (res)
    return true;
  else
    throw 'Something went wrong';
};

const deleteFromList = async (id, user, listType) => {
  const valueToDelete = listType === Lists.myList ?
    {myList: id} :
    {watched: id};

  const res = await User
    .findByIdAndUpdate(user.id, {
      $pull: valueToDelete
    }, {new: true})
    .lean();
  if (res)
    return true;
  else
    throw 'Something went wrong';
};

const getMyList = async id => {
  console.log(id)
  const res = await User.findById(id, 'myList');

  if (res)
    return res.myList;
  else
    throw 'User not found';
};

module.exports = {
  addToList,
  getMyList,
  deleteFromList,
  Lists
};
