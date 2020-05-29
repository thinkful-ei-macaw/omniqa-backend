const path = require('path');
const express = require('express');
const xss = require('xss');
const QuestionService = require('./question-service');
const { requireAuth } = require('../middleware/jwt-auth');

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


questionRouter
  .route('/')
  // posts a question bound to a specific user and a specific department, defaults to answered: false
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { user_id, question_body, department_id } = req.body;
    const newQuestion = { author: user_id, question_body: question_body, department: department_id, answered: false };
    for (const [key, value] of Object.entries(newQuestion)) {
      if (value == null) {
        return res.status(400).json({ error: `Missing '${key}' in request body` });
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

module.exports = questionRouter;