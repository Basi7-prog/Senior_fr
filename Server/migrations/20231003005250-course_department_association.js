'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addConstraint("Courses",{
      fields:['departmentId'],
      type:'foreign key',
      name:'course_department_association',
      references:{
        table:'Departments',
        field:'id'
      },
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn("Courses",{
      fields:['departmentId'],
      type:'foreign key',
      name:'course_department_association',
      references:{
        table:'Departments',
        field:'id'
      },
    });
  }
};
