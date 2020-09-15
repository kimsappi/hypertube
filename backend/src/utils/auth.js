const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('./config');

const hashPassword = async password => 
  await bcrypt.hash(password, 10);

const generateJWT = data =>
  jwt.sign(data, config.TOKEN_SECRET);

const generateEmailVerification = async data =>
  await bcrypt.hash(
    data.username + new Date() + data.email,
    2
  );

module.exports = {
  hashPassword,
  generateJWT,
  generateEmailVerification
}
