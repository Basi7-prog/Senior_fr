'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        allowNull:false,
        type: Sequelize.STRING
      },
      middleName: {
        allowNull:false,
        type: Sequelize.STRING
      },
      lastName: {
        allowNull:false,
        type: Sequelize.STRING
      },
      userName: {
        allowNull:false,
        type: Sequelize.STRING
      },
      eduLevel: {
        allowNull:false,
        type: Sequelize.STRING
      },
      gender: {
        allowNull:false,
        type: Sequelize.STRING(10)
      },
      phone: {
        allowNull:false,
        type: Sequelize.STRING
      },
      email: {
        allowNull:false,
        type: Sequelize.STRING
      },
      profession: {
        allowNull:false,
        type: Sequelize.STRING
      },
      userType: {
        type: Sequelize.STRING
      },
      password: {
        allowNull:false,
        type: Sequelize.STRING
      },
      Dob: {
        allowNull:false,
        type: Sequelize.DATEONLY
      },
      cpdId: {
        type: Sequelize.INTEGER
      },
      departmentId: {
        type: Sequelize.INTEGER
      },
      isStaff: {
        allowNull:false,
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
    await queryInterface.dropTable('Users');
  }
};