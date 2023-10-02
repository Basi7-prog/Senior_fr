'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Courses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      proposalsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      courseStatus: {
        type: Sequelize.BOOLEAN
      },
      creditHr: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      cpdId: {
        type: Sequelize.INTEGER
      },
      courseRating: {
        type: Sequelize.DECIMAL
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
    await queryInterface.dropTable('Courses');
  }
};