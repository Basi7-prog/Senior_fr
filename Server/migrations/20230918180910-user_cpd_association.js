'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addConstraint('Users',{
      fields:['cpdId'],
      type:'foreign key',
      name:'user_cpd_association',
      references:{
        table:'cpds',
        field:'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.addConstraint('Users',{
      fields:['cpdId'],
      type:'foreign key',
      name:'user_cpd_association',
      references:{
        table:'cpds',
        field:'id'
      }
    })
  }
};
