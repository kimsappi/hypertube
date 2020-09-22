const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { authenticationMiddleware } = require('../utils/auth');


router.post('/new', authenticationMiddleware, async (req, res) => {

    // token tulee headerissa (req.headers.token). Sen tarkistus tahan.
    if (!req.body.username)
        res.json(null);

    const comment = new Comment({
        movieId: req.body.movie,
        user: req.user.id,
        comment: req.body.comment,
        time: Date()
      });

    const result = await comment.save();
    
    res.json(result);
});

router.get('/getComments/:id', async (req, res) => {

    const comments = await Comment.find({
        movieId: req.params.id
    },
    '_id user comment time'
    )
    .populate('user', '_id profilePicture username')
    .sort({ time: -1 })

    res.json({comments: comments});
})

module.exports = router;
