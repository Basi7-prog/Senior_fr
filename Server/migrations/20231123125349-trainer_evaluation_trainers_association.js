'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addConstraint("trainerEvaluations", {
      fields: ["trainerId"],
      type: "foreign key",
      name: "trainer_evaluation_trainers_association",
      references: {
        table: "Trainers",
        field: "id",
      },
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint("trainerEvaluations", {
      fields: ["trainerId"],
      type: "foreign key",
      name: "trainer_evaluation_trainers_association",
      references: {
        table: "Trainers",
        field: "id",
      },
    });
  }
};
