const { Book, Borrower, Borrow } = require('../models');
const { check, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { Parser } = require('json2csv');
const fs = require('fs');
const moment = require('moment');

// Borrow a book
exports.borrowBook = [
  // Validation rules
  [
    check('borrower_id').isInt().withMessage('Borrower ID must be an integer'),
    check('book_id').isInt().withMessage('Book ID must be an integer'),
    check('due_date').isISO8601().withMessage('Due date must be a valid date in ISO 8601 format'),
  ],

  async (req, res) => {
    try {
      const { borrower_id, book_id, due_date, borrow_date = new Date(), return_date = null } = req.body;

      // Check if the book exists
      const book = await Book.findByPk(book_id);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      // Check if the borrower exists
      const borrower = await Borrower.findByPk(borrower_id);
      if (!borrower) {
        return res.status(404).json({ error: 'Borrower not found' });
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
  }
];

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
    // Find the associated book and update the quantity
    const book = await Book.findByPk(borrow.book_id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }    
    
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



// Bonus: Export borrowing processes starting from a specific date to CSV
exports.exportAllBorrowsToCSV = async (req, res) => {
  try {
    // Get the 'fromDate' query parameter
    const { fromDate } = req.query;

    // If fromDate is not provided, default to one month ago
    const startDate = fromDate ? moment(fromDate).toDate() : moment().subtract(1, 'months').toDate();

    // Fetch borrowing processes starting from the specified date
    const borrows = await Borrow.findAll({
      where: {
        borrow_date: { [Op.gte]: startDate }  // Only records where borrow_date is greater than or equal to the start date
      },
      include: [
        { model: Book, as: 'book_borrowed' },
        { model: Borrower, as: 'borrower' }
      ]
    });

    // Log the fetched data
    console.log(borrows); // <-- This will log the data in the console

    if (borrows.length === 0) {
      return res.status(404).json({ message: 'No borrowing records found.' });
    }

    // Prepare data for CSV
    const borrowData = borrows.map(borrow => ({
      borrower: borrow.borrower.name,
      book: borrow.book_borrowed.title,
      borrow_date: borrow.borrow_date,
      due_date: borrow.due_date,
      return_date: borrow.return_date || 'Not returned',
    }));

    // Log the mapped data
    console.log(borrowData); // <-- Log the mapped data for CSV

    // Convert JSON to CSV
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(borrowData);

    // Write CSV to file
    fs.writeFileSync('borrows.csv', csv);

    // Send CSV file as response
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=borrows.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Bonus: Export overdue borrows of the last month to CSV
exports.exportOverdueBorrowsToCSV = async (req, res) => {
  try {
    // Get the date of one month ago
    const lastMonth = moment().subtract(1, 'months').toDate();

    // Fetch overdue borrows from the last month
    const overdueBorrows = await Borrow.findAll({
      where: {
        due_date: { [Op.lt]: new Date() }, // Past due date
        return_date: null, // Not yet returned
        borrow_date: { [Op.gte]: lastMonth } // Borrowed within the last month
      },
      include: [
        { model: Book, as: 'book_borrowed' },
        { model: Borrower, as: 'borrower' }
      ]
    });

    // Prepare data for CSV
    const overdueData = overdueBorrows.map(borrow => ({
      borrower: borrow.borrower.name,
      book: borrow.book_borrowed.title,
      borrow_date: borrow.borrow_date,
      due_date: borrow.due_date
    }));

    // Convert JSON to CSV
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(overdueData);

    // Write CSV to file
    fs.writeFileSync('overdue_borrows.csv', csv);

    // Send CSV file as response
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=overdue_borrows.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
