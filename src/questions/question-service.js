const QuestionService = {
  getQuestionList(db) {
    return db('questions')
   .select('questions.*', 'departments.name as department_name', 'users.name as user_name')
     .join('departments', 'questions.department', 'departments.id')
     .join('users', 'questions.author', 'users.id');
  },

  insertQuestion(db, newQuestion) {
    return db
      .insert(newQuestion)
      .into('questions')
      .returning('*')
      .then(rows => rows[0]);
  },
  getQuestionsById(db, id) {
    return db
      .from('questions')
      .select('*')
      .where('id', id)
      .first();
  },
  getId(db, id) {
    return db('questions').select('*').where({
      id
    }).first();
  },
  deleteQuestion(db, id) {
    return db('questions').where({
      id
    }).delete().returning('*');
  },

  updateQuestion(db, id, newQuestionFields) {
    return db('questions').where({
      id
    }).update(newQuestionFields).returning('*');
  }
};

module.exports = QuestionService;