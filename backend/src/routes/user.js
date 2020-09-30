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
	try {
		const userData = await User.findById(req.user.id,
			'username firstName lastName email password profilePicture language'
		);
		res.json(userData);
	} catch(err) {
		Logger.error(err);
		res.json(null);
	}
})

router.get('/:id', authenticationMiddleware, async (req, res) => {
	try {
		const userData = await User.findById(req.params.id,
		'username firstName lastName profilePicture myList language'
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

// Changing your own profile data
router.patch('/:id', authenticationMiddleware, async (req, res, next) => {
	// User is trying to change someone else's data
	if (req.user.id !== req.body._id)
		return res.status(401);

	try {
		const result = await userService.updateProfile(req.body);
		if (!result)
			throw 'Something went wrong';
		else
			return res.status(200).json({
				email: result.email,
				firstName: result.firstName,
				lastName: result.lastName,
				language: result.language
			});
	} catch(err) {
		Logger.error(err);
		const statusReturns =
			['incorrect formatting', 'password', 'email conflict', 'username conflict',
			'password mismatch'];
		if (statusReturns.includes(err)) {
			const error = new Error('Change request unsuccessful');
			error.statusCode = 400;
			error.status = err;
			next(error);
		}
		else
			return res.status(400).json(null);
	}
});

router.post('/watched', authenticationMiddleware, async (req, res) => {
	if (!req.user.username)
		res.json(null);

	const setPath = `watched.${req.body.imdb}`;
	const response = await User.findByIdAndUpdate(req.user.id, {
		$set: {[setPath]: req.body.percent}
	})

	res.status(201).send("jees");

})

module.exports = router;
