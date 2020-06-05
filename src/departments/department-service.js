
const DepartmentService = {

  getDepartmentList(db) {
    return db('departments').select('*');
  },

  getDepartmentName(db, department_id) {
    return db('departments')
      .where({
        id: department_id
      })
      .select('name')
      .first();
  },
};

module.exports = DepartmentService;