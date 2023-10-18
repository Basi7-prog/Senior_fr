'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addConstraint("trainers", {
      fields: ["courseId"],
      type: "foreign key",
      name: "trainer_course_association",
      references: {
        table: "courses",
        field: "id",
      },
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint("trainers", {
      fields: ["courseId"],
      type: "foreign key",
      name: "trainer_course_association",
      references: {
        table: "courses",
        field: "id",
      },
    });
  }
};
