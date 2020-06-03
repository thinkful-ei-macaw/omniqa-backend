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
  .get(requireAuth, (req, res, next) => {
    const questionID = req.params.question_id;
    QuestionService.getQuestionLikes(req.app.get('db'), questionID)
      .then((numLikes) => {
        res.status(200).json(numLikes);
      })
      .catch(next);
  })

  .post(requireAuth, (req, res, next) => {
    const like = {
      question_id: req.params.question_id,
      user_id: req.user.id
    };
    QuestionService.addLike(req.app.get('db'), like)
      .then(() => {
        res.status(204).end();
      })
      .catch((error) => {
        if (error.constraint == 'like_once') {
          res.status(400).json({
            error: {
              message: 'You can only like once'
            }
          });
        } else {
          next(error);
        }
      });
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
      department
    } = req.body;
    const updateQuestions = {
      question_body,
      department
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

questionRouter
  .route('/:question_id')
  .all(requireAuth, (req, res, next) => {
    QuestionService.getId(req.app.get('db'), req.params.question_id)
      .then(question => {
        if (!question) {
          return res.status(401).json({
            error: {
              message: 'That question does not exist!'
            }
          });
        }

        res.question = question;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeQuestion(res.question));
  })
  .delete(requireAuth, (req, res, next) => {
    QuestionService.deleteQuestion(req.app.get('db'), req.params.question_id)
      .then(() => {
        res.status(201).json({ success: true });
      })
      .catch(next);
  })
  .patch(requireAuth, jsonBodyParser, (req, res, next) => {
    const { question_body, department_id } = req.body;
    const updateQuestion = { question_body, department_id };
    const numOfValues = Object.values(updateQuestion).filter(Boolean).length;
    if (numOfValues === 0) {
      return res.status(400).json({
        error: {
          message: 'Your request body must contain at least one field to update'
        }
      });
    }

    QuestionService.updateQuestion(req.app.get('db'), req.params.question_id, updateQuestion)
      .then(question => {
        res
          .status(200)
          .location(path.posix.join(req.originalUrl + `/${question[0].id}`))
          .json(serializeQuestion(question[0]));
      });
  });

module.exports = questionRouter;
