const bcrypt = require('bcrypt');

const hashPassword = async password => 
  await bcrypt.hash(password, 10);

module.exports = {
  hashPassword
}
