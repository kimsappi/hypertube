const getServerUrl = req =>
  req.protocol + '://' + req.get('host');

module.exports = getServerUrl;
