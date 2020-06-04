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
  })
  .post(requireAuth, (req, res, next) => {
    const like = {
      question_id: req.params.question_id,
      user_id: req.user.id
    };
    LikesService.addLike(req.app.get('db'), like)
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

module.exports = likesRouter;