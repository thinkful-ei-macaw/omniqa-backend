require('dotenv').config();
const knex = require('knex');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const helpers = require('./test-helpers');
const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');

describe('Users Endpoint', function () {
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

  describe('POST /api/users', () => {
    context('Happy path', () => {
      it('responds 201, serialized user, storing bcryped password', () => {
        const newUser = {
          username: 'test username',
          password: 'ASDFasdf12!@',
          name: 'test name'
        };
        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect((res) => {
            console.log(res.body);
            expect(res.body).to.have.property('id');
            expect(res.body.username).to.eql(newUser.username);
            expect(res.body.name).to.eql(newUser.name);
            expect(res.body).to.not.have.property('password');
          })
          .expect((res) => {
            db
              .from('users')
              .select('*')
              .where({
                id: res.body.id
              })
              .first()
              .then((row) => {
                expect(row.username).to.eql(newUser.username);

                return bcrypt.compare(newUser.password, row.password);
              })
              .then((compareMatch) => {
                expect(compareMatch).to.be.true;
              });
          });
      });
    });
  });
});