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


// posts a question bound to a specific user and a specific department, defaults to answered: false
questionRouter
<<<<<<< HEAD
    .route('/')
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
        const { user_id, question_body, department_id } = req.body;
        const newQuestion = { author: user_id, question_body: question_body, department: department_id, answered: false };
        for (const [key, value] of Object.entries(newQuestion)) {
            if (value == null) {
                return res.status(400).json({ error: `Missing '${key}' in request body` });
            }
        }
=======
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
    const { user_id, question_body, department_id } = req.body;
    const newQuestion = { author: user_id, question_body: question_body, department: department_id, answered: false };
    for (const [key, value] of Object.entries(newQuestion)) {
      if (value == null) {
        return res.status(400).json({ error: `Missing '${key}' in request body` });
      }
    }
>>>>>>> 5e2be5b8dc7328fd91fb6fcca29eae0ba6f269e8

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
