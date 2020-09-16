import React from 'react';
import axios from 'axios';

import config from '../../config/config';

const AddToMyList = ({id}) => {
  const addItemToMyList = async () => {
    try {
      const res = await axios.post(config.SERVER_URL + '/api/myList', {magnet: id});
      console.log('added to My List');
    } catch(err) {
      console.warn(err);
    }
  };

  return (
    <button class='btn btn-primary' onClick={addItemToMyList}>Add to My List</button>
  );
};

export default AddToMyList;
