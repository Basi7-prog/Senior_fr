'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {    
    queryInterface.addConstraint("TraineesSummerizedData", {
      fields: ["traineeId"],
      type: "foreign key",
      name: "summary_trainee_association",
      references: {
        table: "trainees",
        field: "id",
      },
    });
  },

  async down (queryInterface, Sequelize) { 
    queryInterface.removeConstraint("TraineesSummerizedData", {
      fields: ["traineeId"],
      type: "foreign key",
      name: "summary_trainee_association",
      references: {
        table: "trainees",
        field: "id",
      },
    });
  }
};
