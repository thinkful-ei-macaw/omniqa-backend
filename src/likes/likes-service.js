const LikesService = {

  getLikes(db, questionID) {
    return db
      .from('question_likes')
      .count('id')
      .where({
        question_id: questionID
      });
  }
};

module.exports = LikesService;