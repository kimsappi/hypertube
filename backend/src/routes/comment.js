const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

router.post('/new', async (req, res) => {

    // token tulee headerissa (req.headers.token). Sen tarkistus tahan.
    if (!req.body.username)
        res.json(null);

    console.log("COMMENT: ", req.body);

    console.log("HEADERTOKEN: ", req.headers.token);

    const comment = new Comment({
        movieId: req.body.movie,
        username: req.body.username,
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
    'username comment'
    );

    console.log("COMMENTS :", comments);

    res.json({comments: comments});
})

module.exports = router;