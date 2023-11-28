'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addConstraint("trainerEvaluations", {
    fields: ["courseId"],
    type: "foreign key",
    name: "trainer_evaluation_course_association",
    references: {
      table: "Courses",
      field: "id",
    },
  });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint("trainerEvaluations", {
    fields: ["courseId"],
    type: "foreign key",
    name: "trainer_evaluation_course_association",
    references: {
      table: "Courses",
      field: "id",
    },
  });
  }
};
