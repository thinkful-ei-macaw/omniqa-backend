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
  getUserLikedQuestions(db, user_id) {
    return db
      .from('question_likes')
      .select('question_id')
      .where('user_id', user_id);
  },
};

module.exports = LikesService;