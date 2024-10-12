const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');

// Route to borrow a book
router.post('/borrows', borrowController.borrowBook);

// Route to return a book
router.put('/returns/:borrow_id', borrowController.returnBook);

// Route to list books borrowed by a borrower
router.get('/borrows/:borrower_id', borrowController.listBooksBorrowed);

// Route to list overdue books
router.get('/overdue', borrowController.listOverdueBooks);

// Extra: to get all active borrowing processes
router.get('/borrows', borrowController.listAllBorrows);

// Bonus: Export all borrowing processes to CSV in a specific period (Default: One Month)
router.get('/export-csv', borrowController.exportAllBorrowsToCSV);

// Bonus: Export overdue borrows of the last month to CSV
router.get('/export-overdue-csv', borrowController.exportOverdueBorrowsToCSV);




module.exports = router;
