const express = require('express');
const departmentRouter = express.Router();
const { requireAuth } = require('../middleware/jwt-auth');
const DepartmentService = require('./department-service');


departmentRouter
  .route('/')
  .get((req, res, next) => {
    DepartmentService.getDepartmentList(req.app.get('db'))
      .then(departments => {
        res.json(departments);
      })
      .catch(next);
  });


departmentRouter
  .route('/:department_id')
  .get(requireAuth, (req, res, next) => {
    const departmentID = req.params.department_id;
    DepartmentService.getDepartmentName(req.app.get('db'), departmentID)
      .then(department_name => {
        if (!department_name) {
          return res.status(404).json({
            error: {
              message: 'Department does not exist'
            }
          });
        } else {
          res.status(201).json({
            department_name
          });
        }
        next();
      })
      .catch(next);

  });

module.exports = departmentRouter;