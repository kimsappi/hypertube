const express = require('express');

const Logger = require('../utils/logger');
const movieListService = require('../services/movieLists');
const { authenticationMiddleware } = require('../utils/auth');

const router = express.Router();

router.post('/', authenticationMiddleware, async (req, res, next) => {
  try {
    const res = await movieListService.addToList(
      req.body.id,
      req.user,
      movieListService.Lists.myList
    );
    return res.status(200).json(true);
  } catch(err) {
    Logger.error(err);
    return res.status(400).json(false);
  }
});

router.get('/', authenticationMiddleware, async (req, res, next) => {
  try {
    const response = await movieListService.getMyList(req.user.id);
    return res.status(200).json(response);
  } catch(err) {
    Logger.error(err);
    return res.status(400).json([]);
  }
});

module.exports = router;
