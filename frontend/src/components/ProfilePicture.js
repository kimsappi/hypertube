import React from 'react';
import defaultPicture from "../images/profile.jpg";
import config from '../config/config'

const ProfilePicture = ({url, className = '', style = {}}) => {
  const src = url ? `${config.SERVER_URL}/${url}` : defaultPicture;

  return (
    <img
      src={src} onError={e => e.target.src=defaultPicture}
      className={className} style={style}
      alt='Profile'
    />
  )
};

export default ProfilePicture;
