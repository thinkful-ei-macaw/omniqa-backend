require('dotenv').config();
const knex = require('knex');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const helpers = require('./test-helpers');
const chai = require('chai');
const supertest = require('supertest');

describe('Likes Endpoint', function () {
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

    describe('npm ', () => {
        context('Given there are likes on a question', () => {
            const newUser = {
                id: 2,
                username: 'test username',
                password: 'ASDFasdf12!@',
                name: 'test name'
            };

            const department = {
                id: 1,
                name: 'Sales'
            };

            const question = {
                id: 1,
                author: 2,
                question_body: 'Test Question',
                department: 1,
                answered: false
            };

            const likeObject =
            {
                question_id: 1,
                user_id: 2
            };

            before('seed users', () => {
                return helpers.seedUsers(db, [newUser])
            });

            before('seed department', () => {
                return helpers.seedDepartment(db, [department]);
            });

            before('seed question', () => {
                return helpers.seedQuestion(db, [question])
            });

            before('seed likes', () => {
                return helpers.seedLikes(db, [likeObject])
            });

            it('responds with a count integer for the question', () => {

                const like = [
                    {
                        count: 1
                    }
                ]
                return supertest(app)
                    .get('/api/likes/:question_id')
                    .set('Authorization', helpers.makeAuthHeader(newUser))
                    .send(like)

            })
        })
    })



});
