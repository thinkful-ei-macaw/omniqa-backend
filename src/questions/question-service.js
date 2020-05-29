const QuestionService = {


    insertQuestion(db, newQuestion) {

        return db
            .insert(newQuestion)
            .into('questions')
            .returning('*')
            .then(rows => rows[0])

    }

}

module.exports = QuestionService;