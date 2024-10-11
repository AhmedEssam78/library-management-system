'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Borrow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // Many-to-One relationship with Books
        Borrow.belongsTo(models.Book, {
          foreignKey: 'book_id',
          as: 'book_borrowed'
        });

        // Many-to-One relationship with Borrowers
        Borrow.belongsTo(models.Borrower, {
          foreignKey: 'borrower_id',
          as: 'borrower'
        });
        };
  }
  
  Borrow.init({
    borrower_id: DataTypes.INTEGER,
    book_id: DataTypes.INTEGER,
    borrow_date: DataTypes.DATE,
    return_date: DataTypes.DATE,
    due_date: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Borrow',
  });
  return Borrow;
};