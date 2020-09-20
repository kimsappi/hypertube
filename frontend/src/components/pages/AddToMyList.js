import React from 'react';
import axios from 'axios';

import config from '../../config/config';

const AddToMyList = ({id}) => {
  const addItemToMyList = async () => {
    console.log(id)
    try {
      const token = localStorage.getItem("HiveflixToken");
      await axios.post(config.SERVER_URL + '/api/myList',
        {id},
        {headers: {authorization: 'Bearer ' + token}});
      console.log('added to My List');
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <button className='btn btn-primary' onClick={addItemToMyList}>Add to My List</button>
  );
};

export default AddToMyList;
