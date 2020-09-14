const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('./config');

const hashPassword = async password => 
  await bcrypt.hash(password, 10);

const generateJWT = data =>
  jwt.sign(data, config.TOKEN_SECRET);

module.exports = {
  hashPassword,
  generateJWT
}
