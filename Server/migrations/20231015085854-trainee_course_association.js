'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addConstraint("trainees", {
      fields: ["courseId"],
      type: "foreign key",
      name: "trainee_course_association",
      references: {
        table: "courses",
        field: "id",
      },
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.addConstraint("trainees", {
      fields: ["courseId"],
      type: "foreign key",
      name: "trainee_course_association",
      references: {
        table: "courses",
        field: "id",
      },
    });
  }
};
