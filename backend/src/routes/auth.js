const express = require('express');
const router = express.Router();

const Logger = require('../utils/logger');
const authService = require('../services/auth');

router.post('/register', async (req, res, next) => {
  try {
    console.log(req.body);
    const data = authService.register(req.body);
    return res.status(201).json('data');
  } catch(err) {
    Logger().error(err);
    return res.status(400).json('registration failure');
  }
});

module.exports = router;
