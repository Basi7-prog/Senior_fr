'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addConstraint("CourseRatings", {
    fields: ["ratingTypeId"],
    type: "foreign key",
    name: "CourseRating_ratingType_association",
    references: {
      table: "rating_types",
      field: "id",
    },
  });
  },

  async down (queryInterface, Sequelize) {    
    queryInterface.removeConstraint("CourseRatings", {
      fields: ["ratingTypeId"],
      type: "foreign key",
      name: "CourseRating_ratingType_association",
      references: {
        table: "rating_types",
        field: "id",
      },
    });
  }
};
