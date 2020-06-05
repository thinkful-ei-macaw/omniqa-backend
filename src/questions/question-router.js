const path = require('path');
const express = require('express');
const xss = require('xss');
const QuestionService = require('./question-service');
const {
  requireAuth
} = require('../middleware/jwt-auth');

const questionRouter = express.Router();
const jsonBodyParser = express.json();

const serializeQuestion = question => ({
  id: question.id,
  author: question.author,
  question_body: xss(question.question_body),
  department: question.department,
  created_date: question.created_date,
  answered: question.answered
});


// posts a question bound to a specific user and a specific department, defaults to answered: false
questionRouter
  .route('/')
  .get((req, res, next) => {
    QuestionService.getQuestionList(req.app.get('db'))
      .then(questions => {
        res.json(questions);
      })
      .catch(next);
  })
  // posts a question bound to a specific user and a specific department, defaults to answered: false
  // for frontend:  include bearer token in authorization headers; req.body needs user_id (get from readJwt function), department_id, and question_body 
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const {
      question_body,
      department_id
    } = req.body;
    const newQuestion = {
      author: req.user.id,
      question_body: question_body,
      department: department_id,
      answered: false
    };
    if (typeof department_id !== 'number') {
      res.status(400).json({
        error: 'Department ID must be a number'
      });
    }

    for (const [key, value] of Object.entries(newQuestion)) {
      if (value == null) {
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });
      }
    }

    QuestionService.insertQuestion(req.app.get('db'), newQuestion)
      .then(question => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl + `/${question.id}`))
          .json(serializeQuestion(question));
      })
      .catch(next);
  });

questionRouter
  .route('/:question_id')
  .all((req, res, next) => {
    const knexInstance = req.app.get('db');
    QuestionService.getQuestionsById(knexInstance, req.params.question_id)
      .then(question => {
        if (!question) {
          return res.status(404).json({
            error: {
              message: 'Question does not exist'
            }
          });
        }
        next();
      })
      .catch(next);
  })
  .delete(requireAuth, (req, res, next) => {
    QuestionService.deleteQuestion(req.app.get('db'), req.params.question_id)
      .then(() => {
        res.status(201).json({
          success: true
        });
      })
      .catch(next);
  })
  .patch(requireAuth, jsonBodyParser, (req, res, next) => {
    const {
      question_body,
      department,
      answered
    } = req.body;
    const updateQuestions = {
      question_body,
      department,
      answered
    };
    const numOfValues = Object.values(updateQuestions).filter(Boolean).length;
    if (numOfValues === 0) {
      return res.status(400).json({
        error: {
          message: 'Your request body must contain at least one field to update'
        }
      });
    }

    QuestionService.updateQuestion(req.app.get('db'), req.params.question_id, updateQuestions)
      .then(question => {
        res
          .status(200)
          .location(path.posix.join(req.originalUrl + `/${question[0].id}`))
          .json(serializeQuestion(question[0]));
      })
      .catch(next);
  });

module.exports = questionRouter;
