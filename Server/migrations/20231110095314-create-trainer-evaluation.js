'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('trainerEvaluations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      trainerId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      courseId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      dateOfEvaluation: {
        type: Sequelize.DATE
      },
      Personality_keeping_including_wearing_style: {
        type: Sequelize.DECIMAL
      },
      Training_materials_preparation_status: {
        type: Sequelize.DECIMAL
      },
      Training_methods_used: {
        type: Sequelize.DECIMAL
      },
      Facilitation_skill: {
        type: Sequelize.DECIMAL
      },
      Comprehensive_Knowledge_regarding_to_course_title: {
        type: Sequelize.DECIMAL
      },
      Comprehensive_practical_skill_regarding_to_course_title: {
        type: Sequelize.DECIMAL
      },
      Punctuality: {
        type: Sequelize.DECIMAL
      },
      CRC_Decipline: {
        type: Sequelize.DECIMAL
      },
      Total_score_out: {
        type: Sequelize.DECIMAL
      },      
    voteAmount: {
        type: Sequelize.INTEGER
      },
      Decision_made_for_the_next_training_Competent_Not_competent: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('trainerEvaluations');
  }
};