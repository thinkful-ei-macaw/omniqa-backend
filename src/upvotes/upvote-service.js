const UpvoteService = {
  
  getUpvotes(db, answerID) {
    return db
      .from('answer_upvotes')
      .count('id')
      .where({
        answer_id: answerID
      });
  }
};

module.exports = UpvoteService;