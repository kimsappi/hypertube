const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { authenticationMiddleware } = require('../utils/auth');


router.post('/new', authenticationMiddleware, async (req, res) => {

    // token tulee headerissa (req.headers.token). Sen tarkistus tahan.
    if (!req.body.username)
        res.json(null);

    console.log("COMMENT: ", req.body);

    console.log("HEADERTOKEN: ", req.headers.authorization);

    const comment = new Comment({
        movieId: req.body.movie,
        username: req.body.username,
        id: req.body.id,
        comment: req.body.comment,
        time: Date()
      });

    const result = await comment.save();
    
    console.log(result);
    res.json(result);
});

router.get('/getComments/:id', async (req, res) => {
    console.log(req.params.id);
    console.log("get comments");

    const comments = await Comment.find({
        movieId: req.params.id
    },
    '_id username id comment time'
	)
	.sort({ time: -1 })

    console.log("COMMENTS :", comments);

    res.json({comments: comments});
})

module.exports = router;