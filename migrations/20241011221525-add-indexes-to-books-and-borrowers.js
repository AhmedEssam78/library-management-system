'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adding indexes to Books table
    await queryInterface.addIndex('Books', ['title']);
    await queryInterface.addIndex('Books', ['author']);
    await queryInterface.addIndex('Books', ['ISBN']);
    
    // Adding indexes to Borrowers table
    await queryInterface.addIndex('Borrowers', ['name']);
    await queryInterface.addIndex('Borrowers', ['email']);
  },

  down: async (queryInterface, Sequelize) => {
    // Removing indexes from Books table
    await queryInterface.removeIndex('Books', ['title']);
    await queryInterface.removeIndex('Books', ['author']);
    await queryInterface.removeIndex('Books', ['ISBN']);
    
    // Removing indexes from Borrowers table
    await queryInterface.removeIndex('Borrowers', ['name']);
    await queryInterface.removeIndex('Borrowers', ['email']);
  }
};
