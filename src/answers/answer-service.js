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

  }

};

module.exports = AnswerService;