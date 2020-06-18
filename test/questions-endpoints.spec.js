require('dotenv').config();
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');


describe('Question endpoints', () => {
    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db);
    });

    after('disconnect from db', () => db.destroy());

    before('cleanup', () => helpers.cleanTables(db));

    afterEach('cleanup', () => helpers.cleanTables(db));

    describe('GET /api/questions', () => {
        context('Given there are questions to retrieve from database', () => {

            const newUser = {
                id: 1,
                username: 'test username',
                password: 'ASDFasdf12!@',
                name: 'test name'
            };

            const question = {
                id: 1,
                author: 1,
                question_body: 'Test Question',
                department: 1,
                answered: false
            };

            const department = {
                id: 1,
                name: 'Sales'
            };

            before('seed users', () => {
                return helpers.seedUsers(db, [newUser]);
            });

            before('seed department', () => {
                return helpers.seedDepartment(db, [department]);
            });

            before('seed question', () => {
                return helpers.seedQuestion(db, [question]);
            });

            it('responds with an array of questions in JSON format', () => {

                const questionList = [
                    {
                        id: 1,
                        author: 1,
                        question_body: 'test question body',
                        department: 1,
                        created_date: 'created date',
                        answered: false,
                        liked: false
                    }
                ]
                return supertest(app)
                    .get('/api/questions')
                    .set('Authorization', helpers.makeAuthHeader(newUser))
                    .send(questionList)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body).to.be.an('array');
                    });
            });
        });
    });

    describe('POST /api/questions', () => {
        context('Given there are questions to post in the database', () => {
            const newUser = {
                id: 1,
                username: 'test username',
                password: 'ASDFasdf12!@',
                name: 'test name'
            };
            const question = {
                author: 1,
                question_body: 'Test Question',
                department: 1,
            };

            const department = {
                id: 1,
                name: 'Sales'
            };

            before('seed users', () => {
                return helpers.seedUsers(db, [newUser]);
            });

            before('seed department', () => {
                return helpers.seedDepartment(db, [department]);
            });

            before('seed question', () => {
                return helpers.seedQuestion(db, [question]);
            });

            it('creates a new question, responding 201 with the new question', () => {
                const question = {
                    question_body: 'Test Question',
                    department_id: 1,
                }

                return supertest(app)
                    .post('/api/questions')
                    .set('Authorization', helpers.makeAuthHeader(newUser))
                    .send(question)
                    .expect(201)
                    .expect((res) => {
                        expect(res.body.question_body).to.eql(question.question_body);
                    });
            });
        });
    });
});

// /api/questions:
//  GET

//  POST

// /api/questions/:question_id

//  DELETE

//  PATCH