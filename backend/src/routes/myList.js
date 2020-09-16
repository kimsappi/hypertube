const express = require('express');

const Logger = require('../utils/logger');
const movieListService = require('../services/movieLists');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    await movieListService.addToList(
      req.body.id,
      req.user,
      true
    );
    Logger.log('WIP');
  } catch(err) {
    Logger.error('WIP');
  }
});

module.exports = router;
