'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     * semeneh - Zewudittu,
 Meymuna - Menelik HO,
Woinshet - Menelik ll Health science college,
Tadelech - Tirunesh Bejjing HO,
S/r mulunesh - Ghandi HO &
Guchi - Yekatit 12 MCHO
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
return queryInterface.bulkInsert('cpds',[{
  name:'Zewudittu'
},{
  name:'Menelik HO'
},{
  name:'Menelik ll Health science college'
},{
  name:'Tirunesh Bejjing HO'
},{
  name:'Ghandi HO'
},{
  name:'Yekatit 12 MCHO'
}]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
