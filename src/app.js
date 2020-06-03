require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const usersRouter = require('./users/users-router');
const authRouter = require('./auth/auth-router');
const questionRouter = require('./questions/question-router');
const answerRouter = require('./answers/answer-router');
const upvoteRouter = require('./upvotes/upvote-router');
const likesRouter = require('./likes/likes-router');
const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

// set up middleware
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/questions', questionRouter);
app.use('/api/answers', answerRouter);
app.use('/api/upvotes', upvoteRouter);
app.use('/api/likes', likesRouter);

// error handling
// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'Server error' } };
  } else {
    response = { message: error.message, error };
  }

  res.status(500).json(response);
};

app.use(errorHandler);

// the bottom line, literally
module.exports = app;