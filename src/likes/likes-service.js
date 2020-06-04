const LikesService = {

  getLikes(db, questionID) {
    return db
      .from('question_likes')
      .count('id')
      .where({
        question_id: questionID
      });
  },
  addLike(db, like) {
    return db
      .insert(like)
      .into('question_likes');
  },
};

module.exports = LikesService;