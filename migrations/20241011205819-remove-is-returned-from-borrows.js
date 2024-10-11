'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Borrows', 'is_returned');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Borrows', 'is_returned', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  }
};
