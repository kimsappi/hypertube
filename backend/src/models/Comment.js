const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    movieId: {type: Number},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comment: String,
    time: Date
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
