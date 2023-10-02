"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addConstraint("Proposals", {
      fields: ["departmentId"],
      type: "foreign key",
      name: "proposal_department_association",
      references: {
        table: "departments",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeConstraint("Proposals", {
      fields: ["departmentId"],
      type: "foreign key",
      name: "proposal_department_association",
      references: {
        table: "departments",
        field: "id",
      },
    });
  },
};
