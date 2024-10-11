const { Book, Borrower, Borrow } = require('../models');
const { Op } = require('sequelize');

// Borrow a book
exports.borrowBook = async (req, res) => {
  try {
    const { borrower_id, book_id, due_date, borrow_date = new Date(), return_date = null } = req.body;

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

    // Validate dates
    if (new Date(borrow_date) > new Date()) {
      return res.status(400).json({ error: 'Borrow date cannot be in the future' });
    }
    
    // Borrow the book
    const borrow = await Borrow.create({
      borrower_id,
      book_id,
      borrow_date,
      return_date,
      due_date
    });

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

    // Check if the book has already been returned
    if (borrow.return_date) {
      return res.status(400).json({ error: 'This book has already been returned' });
    }

    // Find the book and update its available quantity
    const book = await Book.findByPk(borrow.book_id);
    await book.update({ available_quantity: book.available_quantity + 1 });

    // Set the return date to the current date
    const return_date = new Date();
    await borrow.update({ return_date });

    res.status(200).json({ message: 'Book returned successfully', borrow });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// List books borrowed by a borrower
exports.listBooksBorrowed = async (req, res) => {
  try {
    const books_borrowed = await Borrow.findAll({
        where: { borrower_id: req.params.borrower_id, 
          return_date: null  // Only include books that haven't been returned yet
        },
        include: [
          { model: Book, as: 'book_borrowed' },          // Use the correct alias 'book'
          { model: Borrower, as: 'borrower' }   // Use the correct alias 'borrower'
        ]
      });

    res.status(200).json(books_borrowed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// List overdue books
exports.listOverdueBooks = async (req, res) => {
    try {
      const Books_overdue = await Borrow.findAll({
        where: {
          due_date: { [Op.lt]: new Date(),
          return_date: null                   // Only include books that haven't been returned
           } 
        },
        include: [
          { model: Book, as: 'book_borrowed' },      
          { model: Borrower, as: 'borrower' } 
        ]
      });
  
      res.status(200).json(Books_overdue);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


//Extra: List all active borrowing processes
exports.listAllBorrows = async (req, res) => {
    try {
      const borrowing_processes = await Borrow.findAll({
        where: {
          return_date: null  // Only include borrowing processes where the book has not been returned
        },

        include: [
          { model: Book, as: 'book_borrowed' },       // Include associated books
          { model: Borrower, as: 'borrower' } // Include associated borrowers
        ]
      });
  
      res.status(200).json(borrowing_processes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
