'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addConstraint('Users',{
      fields:['departmentId'],
      type:'foreign key',
      name:'user_department_association',
      references:{
        table:'Departments',
        field:'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users',{
      fields:['departmentId'],
      type:'foreign key',
      name:'user_department_association',
      references:{
        table:'Departments',
        field:'id'
      }
    })
  }
};
