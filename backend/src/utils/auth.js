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

const verifyToken = async token => {
  try {
    const user = await jwt.verify(token, config.TOKEN_SECRET);
    return user;
  } catch(err) {
    return null;
  }
}

// Use this middleware on a router to make sure only logged in users can access
// the endpoint. Will decode the user's token as req.user or return 401 if token
// is invalid or not found.
const authenticationMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
      return res.status(401).json('auth error');
    else {
      const user = await verifyToken(token);
      if (!user)
        return res.status(401).json('auth error');
      else {
        req.user = user;
        next();
      }
    }
  } catch(err) {
    return res.status(401).json('auth error');
  }
};

module.exports = {
  hashPassword,
  generateJWT,
  generateEmailVerification,
  authenticationMiddleware,
  verifyToken
}
