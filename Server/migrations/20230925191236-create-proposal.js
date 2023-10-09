'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Proposals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      topic: {
        allowNull: false,
        type: Sequelize.STRING
      },
      departmentId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      startDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      endDate: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      numberOfFacilitator: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      targetProfession: {
        allowNull: false,
        type: Sequelize.STRING
      },
      numberOfTrainee: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      numberOfTrainer: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      budget: {
        allowNull: false,
        type: Sequelize.DECIMAL(20,4)
      },
      requestDate: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      budgetApprovedRejectedDate: {
        type: Sequelize.DATEONLY
      },
      venueApprovedRejectedDate: {
        type: Sequelize.DATEONLY
      },
      approveBudgetStatus: {
        type: Sequelize.BOOLEAN
      },
      CPDId: {
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
    await queryInterface.dropTable('Proposals');
  }
};