'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addConstraint("courses",{
      fields:['cpdId'],
      type:'foreign key',
      name:'courses_cpd_association',
      references:{
        table:'cpds',
        field:'id'
      },
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint("courses",{
      fields:['cpdId'],
      type:'foreign key',
      name:'courses_cpd_association',
      references:{
        table:'cpds',
        field:'id'
      },
    });
  }
};
