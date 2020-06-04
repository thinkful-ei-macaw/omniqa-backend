const UpvoteService = {
  
  getUpvotes(db, answerID) {
    return db
      .from('answer_upvotes')
      .count('id')
      .where({
        answer_id: answerID
      });
  },
  addUpvote(db, upvote) {
    return db
      .insert(upvote)
      .into('answer_upvotes');
  },
};

module.exports = UpvoteService;