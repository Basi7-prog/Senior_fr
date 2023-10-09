'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addConstraint("Facilitators",{
      fields:['userId'],
      type:'foreign key',
      name:'facilitator_user_association',
      references:{
        table:'Users',
        field:'id'
      },
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint("Facilitators",{
      fields:['userId'],
      type:'foreign key', 
      name:'facilitator_user_association',
      references:{
        table:'Users',
        field:'id'
      },
    });
  }
};
