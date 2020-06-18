const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');
const config = require('../src/config');

describe('Auth Endpoints', function() {
  let db;
  const testUsers = helpers.makeUsersArray();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  /**
   * @description Get token for login
   **/
  describe(`POST /api/auth/login`, () => {
    beforeEach('insert users', () => helpers.seedUsers(db, testUsers));

    const requiredFields = [ 'username', 'password' ];

    requiredFields.forEach((field) => {
      const loginAttemptBody = {
        username: testUser.username,
        password: testUser.password
      };

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field];

        return supertest(app).post('/api/auth/login').send(loginAttemptBody).expect(400, {
          error: `Missing '${field}' in request body`
        });
      });
    });

    it(`responds 400 'invalid username or password' when bad username`, () => {
      const userInvalidUser = {
        username: 'user-not',
        password: 'existy'
      };
      return supertest(app).post('/api/auth/login').send(userInvalidUser).expect(400, {
        error: `Incorrect username or password`
      });
    });

    it(`responds 400 'invalid username or password' when bad password`, () => {
      const userInvalidPass = {
        username: testUser.username,
        password: 'incorrect'
      };
      return supertest(app).post('/api/auth/login').send(userInvalidPass).expect(400, {
        error: `Incorrect username or password`
      });
    });

    it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
      const userValidCreds = {
        username: testUser.username,
        password: testUser.password
      };
      return supertest(app).post('/api/auth/login').send(userValidCreds).expect(200).expect((res) => {
        let token = res.body.authToken;
        let payload = jwt.verify(token, config.JWT_SECRET);
        expect(payload.user_id).equal(1);
      });
    });
  });
});
