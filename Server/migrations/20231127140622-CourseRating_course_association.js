'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addConstraint("CourseRatings", {
    fields: ["courseId"],
    type: "foreign key",
    name: "CourseRating_course_association",
    references: {
      table: "Courses",
      field: "id",
    },
  });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint("CourseRatings", {
    fields: ["courseId"],
    type: "foreign key",
    name: "CourseRating_course_association",
    references: {
      table: "Courses",
      field: "id",
    },
  });
  }
};
