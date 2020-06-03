const express = require('express');
const path = require('path');
const UsersService = require('./users-service');

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter
  .route('/')
  .post(jsonBodyParser, (req, res, next) => {
    const {
      name,
      username,
      password
    } = req.body;

    for (const field of ['name', 'username', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });

    // TODO: check username doesn't start with spaces

    const passwordError = UsersService.validatePassword(password);

    if (passwordError)
      return res.status(400).json({
        error: passwordError
      });

    UsersService.hasUserWithUserName(
      req.app.get('db'),
      username
    )
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({
            error: 'Username already taken'
          });

        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              name,
              username,
              password: hashedPassword,

            };

            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(UsersService.serializeUser(user));
              });
          });
      })
      .catch(next);
  });

usersRouter
  .route('/:user_id')
  .get((req, res, next) => {
    const userID = req.params.user_id;
    UsersService.getName(req.app.get('db'), userID)
      .then(name => {
        if (!name) {
          return res.status(404).json({
            error: {
              message: 'Name does not exist'
            }
          });
        } else {
          res.status(201).json({name});
        }
        next();
      })
      .catch(next);
  });


module.exports = usersRouter;