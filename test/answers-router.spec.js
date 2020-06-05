require('dotenv').config();
const knex = require('knex');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const helpers = require('./test-helpers');
const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');

describe('Answer endpoint', function () {

    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db', db);
    });

    after('disconnect from db', () => db.destroy());

    before('cleanup', () => helpers.cleanTables(db));

    afterEach('cleanup', () => helpers.cleanTables(db));

    describe('POST /api/answers', () => {
        context('Given there are answers to post in the database', () => {
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
            }

            before('seed users', () => {
                return helpers.seedUsers(db, [newUser])
            })

            before('seed department', () => {
                return helpers.seedDepartment(db, [department])
            })

            before('seed question', () => {
                return helpers.seedQuestion(db, [question])
            })
            it('creates a new answer, responding 201 and the new answer', function () {
                const answer = {
                    answer_body: 'test answer',
                    question_id: 1
                };


                return supertest(app)
                    .post('/api/answers')
                    .set('Authorization', helpers.makeAuthHeader(newUser))
                    .send(answer)
                    .expect(201)
                    .expect(res => {
                        console.log(res.body)
                        expect(res.body).to.have.property('id');
                        expect(res.body.answer_body).to.eql(answer.answer_body);
                        expect(res.body.question).to.eql(answer.question_id);

                    })

            })



        })
    })




})