"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users", [
      {
        firstName: 'Basleal',
        middleName: 'Senbeto',
        lastName: 'Julla',
        gender: 'Male',
        phone: '+251921758665',
        email: 'asdffa@gmail.com',
        profession: "Bachelor's Degree in Computer Science",
        userType: 'Director',
        password: 'papa',
        departmentId: '1',
        cpdId:null,
        Dob: '1997-04-03'
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
