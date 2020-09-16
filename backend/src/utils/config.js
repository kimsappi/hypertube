const publicConfig = require('../config.public.json');
const secretConfig = require('../config.secret.json');



module.exports = {
  ...publicConfig,
  ...secretConfig
};
