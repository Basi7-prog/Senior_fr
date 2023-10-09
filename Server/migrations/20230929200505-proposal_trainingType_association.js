"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // queryInterface.addConstraint("Proposals", {
    //   fields: ["CPDId"],
    //   type: "foreign key",
    //   name: "proposal_cpd_association",
    //   references: {
    //     table: "cpds",
    //     field: "id",
    //   },
    // });
  },

  async down(queryInterface, Sequelize) {
    // queryInterface.removeConstraint("Proposals", {
    //   fields: ["CPDId"],
    //   type: "foreign key",
    //   name: "proposal_cpd_association",
    //   references: {
    //     table: "cpds",
    //     field: "id",
    //   },
    // });
  },
};
