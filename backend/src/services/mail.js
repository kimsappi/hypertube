const registration = async data => {
  return true;
};

// Link should probably be to /api/auth/forgotPassword/{id}?code={emailVerification}
const forgotPassword = async data => {
  return true;
};

module.exports = {
  registration,
  forgotPassword
}
