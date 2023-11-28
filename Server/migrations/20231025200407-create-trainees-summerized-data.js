'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TraineesSummerizedData', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fullName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      profession: {
        allowNull: false,
        type: Sequelize.STRING
      },
      eduLevel: {
        allowNull: false,
        type: Sequelize.STRING
      },
      telephoneNo: {
        allowNull: false,
        type: Sequelize.STRING
      },
      traineeId: {
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
    await queryInterface.dropTable('TraineesSummerizedData');
  }
};