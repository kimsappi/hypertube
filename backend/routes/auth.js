const express = require('express');
const router = express.router();

router.post('/register', async (req, res, next) => {
  //if (validateRegistrationData(req.body)) {

  //}
  // else
    return res.status(400).json('registration failure');
});

module.exports = router;
