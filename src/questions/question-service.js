const QuestionService = {
  getQuestionList(db) {
    return db('questions').select('*');
  },

  insertQuestion(db, newQuestion) {

    return db
      .insert(newQuestion)
      .into('questions')
      .returning('*')
      .then(rows => rows[0]);

  }

};

module.exports = QuestionService;