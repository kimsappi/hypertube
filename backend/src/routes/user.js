const express = require('express');
const multer = require('multer');

const User = require('../models/User');
const { authenticationMiddleware } = require('../utils/auth');
const Logger = require('../utils/logger');
const profilePicService = require('../services/profilePic');
const userService = require('../services/user');

const router = express.Router();
const upload = multer({dest: __dirname + '/../../tmp/'});

router.get('/me/', authenticationMiddleware, async (req, res) => {
	console.log(req.user.id);
	console.log("get my user data");

	try {
		const userData = await User.findById(req.user.id,
			'username firstName lastName email password profilePicture'
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
		const result = await profilePicService.uploadPhoto(req.file, req.user);

		if (result)
			return res.status(200).json(result);
		else
			throw 'Failed to upload image';
	} catch(err) {
		Logger.error(err);
		return res.status(400).json(null);
	}
});

router.patch('/:id', authenticationMiddleware, async (req, res, next) => {
	// User is trying to change someone else's data
	if (req.user.id !== req.body._id)
		return res.status(401);
	console.log(req.body);
	try {
		const result = await userService.updateProfile(req.body);
		if (!result)
			throw 'Something went wrong';
		else
			return res.status(200).json({
				email: result.email,
				firstName: result.firstName,
				lastName: result.lastName
			});
	} catch(err) {
		Logger.error(err);
		return res.status(400);
	}
});

module.exports = router;
