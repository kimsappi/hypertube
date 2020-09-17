const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    movieId: {type: Number},
    username: String,
    id: String,
    comment: String,
    time: Date
});

const alternateCommentSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comment: String
}, {timestamps: true});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
