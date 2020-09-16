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

// Use this middleware on a router to make sure only logged in users can access
// the endpoint. Will decode the user's token as req.user or return 401 if token
// is invalid or not found.
const authenticationMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
      return res.status(401).json('auth error');
    else {
      jwt.verify(token, config.TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(401).json('auth error');
        else {
          req.user = user;
          next();
        }
      });
    }
  } catch(err) {
    return res.status(401).json('auth error');
  }
};

module.exports = {
  hashPassword,
  generateJWT,
  generateEmailVerification
}
