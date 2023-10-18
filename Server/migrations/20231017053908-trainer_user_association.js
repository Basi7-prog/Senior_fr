'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addConstraint("trainers", {
      fields: ["userId"],
      type: "foreign key",
      name: "trainer_user_association",
      references: {
        table: "users",
        field: "id",
      },
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint("trainers", {
      fields: ["userId"],
      type: "foreign key",
      name: "trainer_user_association",
      references: {
        table: "users",
        field: "id",
      },
    });
  }
};
