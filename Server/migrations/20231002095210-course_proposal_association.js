'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addConstraint("Courses",{
      fields:["proposalId"],
      type:"foreign key",
      name:"course_proposal_association",
      references:{
        table:"proposals",
        field:"id"
      },
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint("Courses",{
      fields:["proposalId"],
      type:"foreign key",
      name:"course_proposal_association",
      references:{
        table:"proposals",
        field:"id"
      },
    });
  }
};
