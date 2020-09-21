const express = require('express');
const router = express.Router();

const Logger = require('../utils/logger');
const authService = require('../services/auth');
const mailService = require('../services/mail');
const { generateJWT } = require('../utils/auth');
const { query } = require('express');

router.post('/register', async (req, res, next) => {
  try {
    const data = await authService.register(req.body);
    const mailSent = await mailService.registration(data, req);
    if (!mailSent)
      throw 'email couldn\'t be sent';
    else
      return res.status(201).json(true);
  } catch(err) {
    Logger.error(err);
    if (!err || !err.errors)
      return res.status(200).json({message: 'invalid data'});
    else if (err.errors.username)
      return res.status(200).json({message: 'username already exists'});
    else if (err.errors.email)
      return res.status(200).json({message: 'email used by another account'});
    else
      return res.status(200).json({message: 'invalid data'});
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    console.log("DATA::", data);
    const token = generateJWT(data);
    return res.status(200).json({
      message: 'login success',
      username: data.username,
      token,
      profilePicture: data.profilePicture || null,
      id: data.id
    });
  } catch(err) {
    Logger.error(err);
    return res.status(200).json({message: err});
  }
});

router.post('/forgotPassword', async (req, res, next) => {
  try {
    const email = req.body.email;
    const data = await authService.resetPassword(email);
    const mailSent = await mailService.forgotPassword(data, req);
    return res.status(200).json(mailSent);
  } catch(err) {
    Logger.error(err);
    return res.status(400).json(false);
  }
});

router.patch('/forgotPassword/:id', async (req, res, next) => {
  try {
    const data = await authService.setNewPassword(req.params.id, {
      ...req.body,
      code: req.query.code
    });
    if (data)
      return res.status(200).json(true);
    else
      throw 'couldn\'t update';
  } catch(err) {
    Logger.error(err);
    return res.status(400).json(false);
  }
});

router.get('/confirmEmail/:id', async (req, res, next) => {
  try {
    const data = await authService.confirmEmail(req);
    if (data)
      return res.status(301).redirect('http://localhost:3000?emailConfirmed=1'); // TODO
    else
      throw 'Email confirmation failure';
  } catch(err) {
    Logger.error(err);
    return res.status(301).redirect('http://localhost:3000?emailConfirmationFailure=1'); // TODO
  }
});

module.exports = router;
