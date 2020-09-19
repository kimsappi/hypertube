const express = require('express');
const multer = require('multer');

const User = require('../models/User');
const { authenticationMiddleware } = require('../utils/auth');
const Logger = require('../utils/logger');
const profilePicService = require('../services/profilePic');

const router = express.Router();
const upload = multer({dest: __dirname + '/../../tmp/'});

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

router.post(
	'/profilePic',
	authenticationMiddleware,
	upload.single('photo'),
	async (req, res, next) => {
	try {
		if (!req.file)
			throw 'No file uploaded';
		const result = profilePicService.uploadPhoto(req.file, req.user);
		if (result)
			return res.status(200).json(true);
		else
			throw 'Failed to upload image';
	} catch(err) {
		Logger.error(err);
		return res.status(400).json(false);
	}
});

module.exports = router;
