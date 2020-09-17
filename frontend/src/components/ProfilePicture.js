import React from 'react';
import defaultPicture from "../images/profile.jpg";

const ProfilePicture = ({url, classNames = '', style = {}}) => {
  const src = url ? url : defaultPicture;

  return (
    <img
      src={src} onError={e => e.target.src=defaultPicture}
      className={classNames} style={style}
      alt='Profile'
    />
  )
};

export default ProfilePicture;
