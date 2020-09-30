const validateUsername = username => 
  /^\w{3,20}$/.test(username);

const validatePassword = password => {
  if (password.length < 7)
    return false;

  const strengthTests = [
    /[A-Z]/,
    /[0-9]/
  ];

  const passwordStrength = strengthTests.reduce((total, current) => 
    total + current.test(password)
  , 0);

  return passwordStrength === 2;
};

const validateName = name => 
  /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\-]{1,32}$/.test(name);

const validateEmail = email =>
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    .test(email);

const validateRegistrationData = data => {
  if (data.username && data.password && data.firstName && data.lastName && data.email)
    return validateUsername(data.username) &&
      validatePassword(data.password) &&
      validateName(data.firstName) &&
      validateName(data.lastName) &&
      validateEmail(data.email);
  else
    return false;
};

const validatePhoto = photo => {
  return photo.size < 6000000 && photo.mimetype.substr(0, 6) === 'image/';
};

module.exports = {
  validateRegistrationData,
  validatePassword,
  validatePhoto,
  validateName,
  validateEmail
};
