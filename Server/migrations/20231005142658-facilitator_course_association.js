'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addConstraint("Facilitators",{
      fields:['courseId'],
      type:'foreign key',
      name:'facilitator_course_association',
      references:{
        table:'Courses',
        field:'id'
      },
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint("Facilitators",{
      fields:['courseId'],
      type:'foreign key',
      name:'facilitator_course_association',
      references:{
        table:'Courses',
        field:'id'
      },
    });
  }
};
