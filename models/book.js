'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    // One-to-Many relationship with Borrows
        Book.hasMany(models.Borrow, {
          foreignKey: 'book_id',
          as: 'borrows'
        });
    }
  }
  
  Book.init({
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    ISBN: DataTypes.STRING,
    available_quantity: DataTypes.INTEGER,
    shelf_location: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};