const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const config = require('./config');

const hashPassword = async password => 
  await bcrypt.hash(password, 10);

const generateJWT = data =>
  jwt.sign(data, config.TOKEN_SECRET);

const generateEmailVerification = data => {
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(data));
  return hash.digest('hex');
}

module.exports = {
  hashPassword,
  generateJWT,
  generateEmailVerification
}
