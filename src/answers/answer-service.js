const AnswerService = {
  getAnswerList(db) {
    return db('answers').select('*');
  },

  insertAnswer(db, newAnswer) {

    return db
      .insert(newAnswer)
      .into('answers')
      .returning('*')
      .then(rows => rows[0]);
  },
  addUpvote(db, upvote) {
    return db
      .insert(upvote)
      .into('answer_upvotes');
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
};

module.exports = AnswerService;