'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Trainees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      courseId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      attendance: {
        type: Sequelize.TEXT('long')
      },
      preTest: {
        type: Sequelize.INTEGER
      },
      postTest: {
        type: Sequelize.INTEGER
      },
      isNowTrainer: {
        type: Sequelize.BOOLEAN
      },
      trainerRate: {
        type: Sequelize.BOOLEAN
      },
      courseRate: {
        type: Sequelize.BOOLEAN
      },
      certified: {
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
    await queryInterface.dropTable('Trainees');
  }
};