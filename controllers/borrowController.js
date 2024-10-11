const { Book, Borrower, Borrow } = require('../models');
const { Op } = require('sequelize');

// Borrow a book
exports.borrowBook = async (req, res) => {
  try {
    const { borrower_id, book_id, due_date } = req.body;

    // Find the book and borrower
    const book = await Book.findByPk(book_id);
    const borrower = await Borrower.findByPk(borrower_id);

    if (!book || !borrower) {
      return res.status(404).json({ error: 'Book or Borrower not found' });
    }

    // Check if the book is available
    if (book.available_quantity < 1) {
      return res.status(400).json({ error: 'Book is not available' });
    }

    // Borrow the book
    const borrow = await Borrow.create({ borrower_id, book_id, due_date });
    await book.update({ available_quantity: book.available_quantity - 1 });

    res.status(201).json(borrow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Return a book
exports.returnBook = async (req, res) => {
  try {
    const { borrow_id } = req.params;

    // Find the borrowing record
    const borrow = await Borrow.findByPk(borrow_id);

    if (!borrow) {
      return res.status(404).json({ error: 'Borrow record not found' });
    }

    // Find the book and update its available quantity
    const book = await Book.findByPk(borrow.book_id);
    await book.update({ available_quantity: book.available_quantity + 1 });

    // Delete the borrow record
    await borrow.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// List books borrowed by a borrower
exports.listBorrowedBooks = async (req, res) => {
  try {
    const { borrower_id } = req.params;

    const borrowedBooks = await Borrow.findAll({
      where: { borrower_id },
      include: [{ model: Book, as: 'book' }]
    });

    res.status(200).json(borrowedBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// List overdue books
exports.listOverdueBooks = async (req, res) => {
    try {
      const overdueBooks = await Borrow.findAll({
        where: {
          due_date: { [Op.lt]: new Date() } 
        },
        include: [
          { model: Book, as: 'book' },      
          { model: Borrower, as: 'borrower' } 
        ]
      });
  
      res.status(200).json(overdueBooks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


//Extra: List all borrowing processes
exports.listAllBorrows = async (req, res) => {
    try {
      const borrows = await Borrow.findAll({
        include: [
          { model: Book, as: 'book' },       // Include associated books
          { model: Borrower, as: 'borrower' } // Include associated borrowers
        ]
      });
  
      res.status(200).json(borrows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
