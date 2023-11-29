"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert("rating_types", [
      {
        type: "Overall training content",
      },
      {
        type: "Training methods",
      },
      {
        type: "Trainers facilitation skill",
      },
      {
        type: "Participation status",
      },
      {
        type: "Refreshment services",
      },
      {
        type: "Training venue",
      },
      {
        type: "Training materials preparation",
      },
      {
        type: "Experience sharing",
      },
      {
        type: "Time allocation for each course title",
      },
      {
        type: "Overall  training facilitation",
      },
      {
        type: "Overall  training coordination",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
