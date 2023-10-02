"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addConstraint("Proposals", {
      fields: ["trainingTypeId"],
      type: "foreign key",
      name: "proposal_trainingtype_association",
      references: {
        table: "TrainingTypes",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeConstraint("Proposals", {
      fields: ["trainingTypeId"],
      type: "foreign key",
      name: "proposal_trainingtype_association",
      references: {
        table: "TrainingTypes",
        field: "id",
      },
    });
  },
};
