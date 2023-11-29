'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CourseRatings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      courseId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      excellent: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      veryGood: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      UnableToDecide: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      poor: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      veryPoor: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      ratingTypeId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      ExpectedNoOfParticipants: {
        type: Sequelize.INTEGER
      },
      TotalParticipanted: {
        type: Sequelize.INTEGER
      },
      ResponseRate: {
        type: Sequelize.INTEGER
      },
      SatisfactionRate: {
        type: Sequelize.INTEGER
      },
      UnableToDecideRate : {
        type: Sequelize.INTEGER
      },
      PoorSatisfactionRate : {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CourseRatings');
  }
};