var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');

const Logger = require('./utils/logger');
const config = require('./utils/config');

const authRouter = require('./routes/auth');
const commentRouter = require('./routes/comment');
const userRouter = require('./routes/user');
const cinemaRouter = require('./routes/cinema');
const myListRouter = require('./routes/myList');
const schoolLogin = require('./routes/login42');
const githubLogin = require('./routes/github');
const { ETXTBSY } = require('constants');

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

mongoose.connection.on('error', err => {
  Logger.error('Mongoose connection error:');
  Logger.error(err);
});
mongoose.connection.on('connected', () => {
  Logger.log('Mongoose connected.');
});

var app = express();


app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(mongoSanitize());

// Public routes
app.use('/api/auth', authRouter);

// Comment routes
app.use('/api/comments', commentRouter);
app.use('/api/users', userRouter);
app.use('/api/cinema', cinemaRouter);
app.use('/api/myList', myListRouter);

// API login routes
app.use('/42', schoolLogin)
app.use('/github', githubLogin)




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development

  return res.status(err.status).json({
    message: err.message
  });
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 406);
  // res.json('error');
});

module.exports = app;
