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
  });

module.exports = upvoteRouter;