const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticationMiddleware } = require('../utils/auth');

router.get('/me/', authenticationMiddleware, async (req, res) => {
	console.log(req.user.id);
	console.log("get user data");

	const userData = await User.find({
		_id: req.user.id
	},
	'username firstname lastname email password profilePicture'
	)
	res.json(userData);
})

router.get('/:id', async (req, res) => {
	console.log(req.params.id);
	console.log("get user data");

	const userData = await User.find({
		_id: req.params.id
	},
	'username firstName lastName profilePicture'
	)

	res.json(userData);
})

module.exports = router;