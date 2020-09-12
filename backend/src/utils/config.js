const public = require('../config.public.json');
const secret = require('../config.secret.json');

module.exports = {
  ...public,
  ...secret
};
