require('dotenv').config();
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');

describe('Departments Endpoint', function () {
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

    describe('GET /api/departments', () => {
        context('Given there are departments to show in the database', () => {

            it('responds with an array of departments in JSON format', () => {
                const departmentList = [
                    {
                        id: 1,
                        name: 'Sales'
                    },
                    {
                        id: 2,
                        name: 'HR'
                    },
                    {
                        id: 3,
                        name: 'Engineering'
                    },
                ]
                return supertest(app)
                    .get('/api/departments')
                    .send(departmentList)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body).to.be.an('array');
                    })
            })
        })
    })

});