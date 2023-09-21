'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('departments',[{
      name:'System Administrator'
    },{
      name:'Finance'
    },{
      name:'Human Resource'
    }]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.delete('users',null,{});
  }
};
