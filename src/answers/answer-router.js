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

answerRouter
  .route('/:answer_id')
  .all((req, res, next) => {
    const knexInstance = req.app.get('db');
    AnswerService.getAnswersById(knexInstance, req.params.answer_id)
      .then(answer => {
        if (!answer) {
          return res.status(404).json({
            error: {
              message: 'Answer does not exist'
            }
          });
        }
        next();
      })
      .catch(next);
  })
  .post(requireAuth, (req, res, next) => {
    const upvote = { answer_id: req.params.answer_id, user_id: req.user.id };
    AnswerService.addUpvote(req.app.get('db'), upvote)
      .then(() => {
        res.status(204).end();
      })
      .catch((error) => {
        if (error.constraint == 'upvote_once') {
          res.status(400).json({
            error: {
              message: 'You can only upvote once'
            }
          });
        } else {
          next(error);
        }
      });
  })
  .delete(requireAuth, (req, res, next) => {
    AnswerService.deleteAnswer(req.app.get('db'), req.params.answer_id)
      .then(() => {
        res.status(201).json({ success: true });
      })
      .catch(next);
  })
  .patch(requireAuth, jsonBodyParser, (req, res, next) => {
    const {
      answer_body
      
    } = req.body;
    const updateAnswers = {
      answer_body
    };
    const numOfValues = Object.values(updateAnswers).filter(Boolean).length;
    if (numOfValues === 0) {
      return res.status(400).json({
        error: {
          message: 'Your request body must contain at least one field to update'
        }
      });
    }

    AnswerService.updateAnswer(req.app.get('db'), req.params.answer_id, updateAnswers)
      .then(answer => {
        res
          .status(200)
          .location(path.posix.join(req.originalUrl + `/${answer[0].id}`))
          .json(serializeAnswer(answer[0]));
      })
      .catch(next);
  });

module.exports = answerRouter;