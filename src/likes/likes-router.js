const express = require('express');
const likesRouter = express.Router();
const { requireAuth } = require('../middleware/jwt-auth');
const LikesService = require('./likes-service');

likesRouter
  .route('/:question_id')
  .get(requireAuth, (req, res, next) => {
    const questionID = req.params.question_id;
    LikesService.getLikes(req.app.get('db'), questionID)
      .then((likes) => {
        res.status(200).json(likes);
      })
      .catch(next);
  });

module.exports = likesRouter;