const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticationMiddleware } = require('../utils/auth');
const Logger = require('../utils/logger');

router.get('/me/', authenticationMiddleware, async (req, res) => {
	console.log(req.user.id);
	console.log("get my user data");

	try {
		const userData = await User.findById(req.user.id,
			'username firstname lastname email password profilePicture'
		);
		res.json(userData);
	} catch(err) {
		Logger.error(err);
		res.json(null);
	}
})

router.get('/:id', authenticationMiddleware, async (req, res) => {
	console.log(req.params.id);
	console.log("get other user data");

	try {
		const userData = await User.findById(req.params.id,
		'username firstName lastName profilePicture'
		);
		res.json(userData);
	} catch(err) {
		Logger.error(err);
		res.json(null);
	}
})

module.exports = router;
