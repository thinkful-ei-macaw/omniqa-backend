const knex = require('knex');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
/**
 * create a knex instance connected to postgres
 */
function makeKnexInstance() {
  return knex({
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL,
  });
}

/**
 * create a knex instance connected to postgres
 * @returns {array of user objects}
 */

function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'test-user-1',
      name: 'Test User 1',
      password: 'password',
    },
    {
      id: 2,
      username: 'test-user-2',
      name: 'Test User 2',
      password: 'password',
    },
  ];
}

/**
 * make a bearer token with jwt for authorization header
 * @param {object} user - contains `id`, `username`
 * @param {string} secret - used to create the JWT
 * @returns {string} - for HTTP authorization header
 */

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256'
  });
  return `Bearer ${token}`;
}

/**
 * remove data from tables and reset sequences for SERIAL id fields
 * @param {knex instance} db
 * @returns {Promise} - when tables are cleared
 */

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
       "users" CASCADE`
    )
      .then(() => {
        return trx.raw(
          `TRUNCATE
           "departments" CASCADE`
        )
      })
      .then(() => {
        return trx.raw(
          `TRUNCATE
           "questions" CASCADE`
        )
      })
      .then(() => {
        return trx.raw(
          `TRUNCATE
           "answers" CASCADE`
        )
      })
      .then(() =>
        Promise.all([
          trx.raw('ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1'),
          trx.raw(`SELECT setval('users_id_seq', 0)`),
          trx.raw('ALTER SEQUENCE questions_id_seq minvalue 0 START WITH 1'),
          trx.raw(`SELECT setval('questions_id_seq', 0)`),
          trx.raw('ALTER SEQUENCE departments_id_seq minvalue 0 START WITH 1'),
          trx.raw(`SELECT setval('departments_id_seq', 0)`),
          trx.raw('ALTER SEQUENCE answers_id_seq minvalue 0 START WITH 1'),
          trx.raw(`SELECT setval('answers_id_seq', 0)`),
        ])));
}

/**
 * insert users into db with bcrypted passwords and update sequence
 * @param {knex instance} db
 * @param {array} users - array of user objects for insertion
 * @returns {Promise} - when users table seeded
 */

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.transaction(async trx => {
    await trx.into('users').insert(preppedUsers)

    await trx.raw(
      `SELECT setval('users_id_seq', ?)`,
      [users[users.length - 1].id],
    )
  })
}

function seedQuestion(db, questions) {

  return db.transaction(async trx => {
    await trx.into('questions').insert(questions)

    // await trx.raw(
    //   `SELECT setval(questions_id_seq, ?)`,
    //   [questions[questions.length - 1].id],
    // )
  })

}

function seedLikes(db, likes) {
  return db.transaction(async trx => {
    await trx.into('question_likes').insert(likes)
  })
}

function seedDepartment(db, departments) {

  return db.transaction(async trx => {
    await trx.into('departments').insert(departments)

    // await trx.raw(
    //   `SELECT setval(departments_id_seq, ?)`,
    //   [departments[departments.length - 1].id],
    // )
  })



}

module.exports = {
  makeKnexInstance,
  makeUsersArray,
  makeAuthHeader,
  cleanTables,
  seedUsers,
  seedQuestion,
  seedDepartment,
  seedLikes
}