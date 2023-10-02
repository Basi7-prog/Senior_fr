'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('TrainingTypes',[{
      type:'Self'
    },{
      type:'Out Sourcing'
    }]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.delete('TrainingTypes',null,{});
  }
};
