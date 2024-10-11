'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Borrower extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // One-to-Many relationship with Borrows
        Borrower.hasMany(models.Borrow, {
          foreignKey: 'borrower_id',
          as: 'borrows'
        });    
      }
  }

  Borrower.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    registered_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Borrower',
  });
  return Borrower;
};