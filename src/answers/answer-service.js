const AnswerService = {
  getAnswerList(db) {
    return db('answers').select('*')
  },
  // join('ancestors', 'ancestors.parentId', 'people.id')

  getJoinQa(db) {
    return db('answers').select('*')
      .join('questions', 'answers.question', 'questions.id')
      .join('users', 'answers.author', 'users.id')
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
<<<<<<< HEAD
  }, 
=======
  },
  getUpvotes(db, answerID) {
    return db
      .from('answer_upvotes')
      .count('id')
      .where({
        answer_id: answerID
      });
  }
>>>>>>> updated answer route
};

//have a method for get answers, questions and authors

module.exports = AnswerService;