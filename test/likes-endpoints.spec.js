require('dotenv').config();
const knex = require('knex');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const helpers = require('./test-helpers');
const chi = require('chai');
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

    describe('GET /api/likes/:question_id', () => {
        context('Given there are likes on a question', () => {
            const newUser = {
                id: 1,
                username: 'test username',
                password: 'ASDFasdf12!@',
                name: 'test name'
            };
            before('seed users', () => {
                return helpers.seedUsers(db, [newUser]);
            });
            it('responds with a count integer for the question', () => {
                const likeArray = [
                    {
                        question_id: 1,
                        user_id: 1
                    }

                ]
                return supertest(app)
                    .get('/api/likes/:question_id')
                    .set('Authorization', helpers.makeAuthHeader(newUser))
                    .send(likeArray)



            })
        })
    })



});
