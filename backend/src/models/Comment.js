const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    movieId: {type: Number},
    username: String,
    comment: String,
    time: Date
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
