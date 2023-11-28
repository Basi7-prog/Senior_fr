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
      OverallTrainingContent: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      TrainingMethods: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      TrainersFacilitationSkill: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      ParticipationStatus: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      RefreshmentServices: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      TrainingVenue: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      TrainingMaterialsPreparation: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      ExperienceSharing: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      TimeAllocationForEachCourseTitle: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      OverallTrainingFacilitation: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      OverallTrainingCoordination: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      ratingTypeId: {
        allowNull: false,
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