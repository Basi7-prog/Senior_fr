'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addConstraint("trainees", {
      fields: ["userId"],
      type: "foreign key",
      name: "trainee_user_association",
      references: {
        table: "users",
        field: "id",
      },
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint("trainees", {
      fields: ["userId"],
      type: "foreign key",
      name: "trainee_user_association",
      references: {
        table: "users",
        field: "id",
      },
    });
  }
};
