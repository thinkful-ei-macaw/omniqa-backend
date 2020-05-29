const path = require('path');
const express = require('express');
const xss = require('xss');
const AnswerService = require('./answer-service');
const { requireAuth } = require('../middleware/jwt-auth');

const answerRouter = express.Router();
const jsonBodyParser = express.json();

const serializeAnswer = answer => ({
  id: answer.id,
  author: answer.author,
  question: answer.question,
  answer_body: xss(answer.answer_body),
  created_date: answer.created_date
});


answerRouter
  .route('/')
  .get((req, res, next) => {
    AnswerService.getAnswerList(req.app.get('db'))
      .then(answers => {
        res.json(answers);
      })
      .catch(next);
  })
  // posts an answer bound to a specific user and a specific question
  // for frontend:  include bearer token in authorization headers; req.body needs user_id (get from readJwt function), question_id, and answer_body 
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { answer_body, question_id } = req.body;
    const newAnswer = { author: req.user.id, answer_body: answer_body, question: question_id };
    for (const [key, value] of Object.entries(newAnswer)) {
      if (value == null) {
        return res.status(400).json({ error: `Missing '${key}' in request body` });
      }
    }

    AnswerService.insertAnswer(req.app.get('db'), newAnswer)
      .then(answer => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl + `/${answer.id}`)) // ask capi
          .json(serializeAnswer(answer));
      })
      .catch(next);
  });

module.exports = answerRouter;