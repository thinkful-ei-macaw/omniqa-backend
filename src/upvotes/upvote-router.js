const express = require('express');
const upvoteRouter = express.Router();
const {requireAuth} = require('../middleware/jwt-auth');
const UpvoteService = require('./upvote-service');

upvoteRouter
  .route('/:answer_id')
  .get(requireAuth, (req, res, next) => {
    const answerID = req.params.answer_id;
    UpvoteService.getUpvotes(req.app.get('db'), answerID)
      .then((numUpvotes) => {
        res.status(200).json(numUpvotes);
      })
      .catch(next);
  })
  .post(requireAuth, (req, res, next) => {
    const upvote = {
      answer_id: req.params.answer_id,
      user_id: req.user.id
    };
    UpvoteService.addUpvote(req.app.get('db'), upvote)
      .then(() => {
        res.status(204).end();
      })
      .catch((error) => {
        if (error.constraint === 'upvote_once') {
          res.status(400).json({
            error: {
              message: 'You can only upvote once'
            }
          });
        } else {
          next(error);
        }
      });
  });

module.exports = upvoteRouter;