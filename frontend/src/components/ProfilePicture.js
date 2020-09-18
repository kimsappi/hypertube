import React from 'react';
import defaultPicture from "../images/profile.jpg";

const ProfilePicture = ({url, className = '', style = {}}) => {
  const src = url ? url : defaultPicture;

  return (
    <img
      src={src} onError={e => e.target.src=defaultPicture}
      className={className} style={style}
      alt='Profile'
    />
  )
};

export default ProfilePicture;
