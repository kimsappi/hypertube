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

router.post('/remove', authenticationMiddleware, async (req, res, next) => {
    console.log("COMMENT ID: ", req.body.commentId);

    try
    {
        const comment = await Comment.findById(req.body.commentId, 'user');

        if (comment.user == req.user.id)
        {
            await Comment.findByIdAndRemove(req.body.commentId);
            return res.status(200).send("Comment removed");
        }
        else
        {
            next(createError(301, "Not your comment"));
            throw "faled to remove comment";
        }    
    }
    catch(err)
    {
        console.log(err)
    }

})

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
