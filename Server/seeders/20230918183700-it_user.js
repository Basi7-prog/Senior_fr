"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users", [
      // {
      //   firstName: 'Basleal',
      //   middleName: 'Senbeto',
      //   lastName: 'Julla',
      //   gender: 'Male',
      //   phone: '+251921758665',
      //   email: 'asdffa@gmail.com',
      //   profession: "Bachelor's Degree in Computer Science",
      //   userType: 'Director',
      //   password: 'papa',
      //   departmentId: '1',
      //   cpdId:null,
      //   Dob: '1997-04-03'
      // },
      {
        firstName: 'Semeneh',
        middleName: 'Deme',
        lastName: 'Shime',
        userName:'seme',
        gender: 'Male',
        phone: '+251911556688',
        email: 'cpd@gmail.com',
        profession: "Doctor",
        userType: '',
        password: '',
        departmentId: null,
        cpdId:'1',
        Dob: '1967-04-03'
      },
      {
        firstName: 'Meymuna',
        middleName: 'Deme',
        lastName: 'Shime',
        userName:'meyD',
        gender: 'Male',
        phone: '+251911556688',
        email: 'cpd@gmail.com',
        profession: "Doctor",
        userType: '',
        password: '',
        departmentId: null,
        cpdId:'2',
        Dob: '1967-04-03'
      },
      {
        firstName: 'Woinshet',
        middleName: 'Deme',
        lastName: 'Shime',
        userName:'woin',
        gender: 'Female',
        phone: '+251911556688',
        email: 'cpd@gmail.com',
        profession: "Doctor",
        userType: '',
        password: '',
        departmentId: null,
        cpdId:'3',
        Dob: '1967-04-03'
      },
      {
        firstName: 'Tadelech',
        middleName: 'Deme',
        lastName: 'Shime',
        userName:'tade',
        gender: 'Female',
        phone: '+251911556688',
        email: 'cpd@gmail.com',
        profession: "Doctor",
        userType: '',
        password: '',
        departmentId: null,
        cpdId:'4',
        Dob: '1967-04-03'
      },
      {
        firstName: 'Mulunesh',
        middleName: 'Deme',
        lastName: 'Shime',
        userName:'mulu',
        gender: 'Female',
        phone: '+251911556688',
        email: 'cpd@gmail.com',
        profession: "Doctor",
        userType: '',
        password: '',
        departmentId: null,
        cpdId:'5',
        Dob: '1967-04-03'
      },
      {
        firstName: 'Guchi',
        middleName: 'Deme',
        lastName: 'Shime',
        userName:'guchi',
        gender: 'Female',
        phone: '+251911556688',
        email: 'cpd@gmail.com',
        profession: "Doctor",
        userType: '',
        password: '',
        departmentId: null,
        cpdId:'6',
        Dob: '1967-04-03'
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
