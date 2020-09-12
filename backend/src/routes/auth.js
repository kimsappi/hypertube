const express = require('express');
const router = express.Router();

const Logger = require('../utils/logger');
const authService = require('../services/auth');
const mailService = require('../services/mail');

router.post('/register', async (req, res, next) => {
  try {
    const data = await authService.register(req.body);
    const mailSent = await mailService.registration(data);
    return res.status(201).json(mailSent);
  } catch(err) {
    Logger.error(err);
    return res.status(400).json(false);
  }
});

module.exports = router;
