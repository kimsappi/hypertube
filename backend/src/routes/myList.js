const express = require('express');

const Logger = require('../utils/logger');
const movieListService = require('../services/movieLists');
const { authenticationMiddleware } = require('../utils/auth');

const router = express.Router();

router.post('/', authenticationMiddleware, async (req, res, next) => {
  try {
    await movieListService.addToList(
      req.body.id,
      req.user,
      true
    );
  } catch(err) {
    Logger.error(err);
  }
});

module.exports = router;
