const AnswerService = {
  getAnswerList(db) {
    return db('answers')
      .select('answers.*', 'users.name as user_name')
      .join('users', 'answers.author', 'users.id');
  },
  insertAnswer(db, newAnswer) {

    return db
      .insert(newAnswer)
      .into('answers')
      .returning('*')
      .then(rows => rows[0]);
  },
  getAnswersById(db, id) {
    return db
      .from('answers')
      .select('*')
      .where('id', id)
      .first();
  },
  deleteAnswer(db, id) {
    return db('answers').where({ id }).delete().returning('*');
  },

  updateAnswer(db, id, newAnswerFields) {
    return db('answers').where({ id }).update(newAnswerFields).returning('*');
  },
  getUpvotes(db, answerID) {
    return db
      .from('answer_upvotes')
      .count('id')
      .where({
        answer_id: answerID
      });
  }
};

//have a method for get answers, questions and authors

module.exports = AnswerService;