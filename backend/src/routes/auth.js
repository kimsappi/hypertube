const express = require('express');
const router = express.Router();

const Logger = require('../utils/logger');
const authService = require('../services/auth');
const mailService = require('../services/mail');
const { hashPassword, generateJWT } = require('../utils/auth');

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

router.post('/login', async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    const token = generateJWT(data);
    return res.status(200).json({
      username: data.username,
      token,
      profilePicture: data.profilePicture || null
    });
  } catch(err) {
    Logger.error(err);
    return res.status(400).json(false);
  }
});

module.exports = router;
