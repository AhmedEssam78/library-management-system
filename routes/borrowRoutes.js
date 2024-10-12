const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');
const basicAuthenti = require('express-basic-auth');


// Route to borrow a book
router.post('/borrows', borrowController.borrowBook);

// Route to return a book
router.put('/returns/:borrow_id', borrowController.returnBook);

// Route to list books borrowed by a borrower
router.get('/borrows/:borrower_id', borrowController.listBooksBorrowed);

// Route to list overdue books
router.get('/overdue', basicAuthenti({ users: { 'admin': 'let.me.in' }, challenge: true, unauthorizedResponse: (req) => 'Unauthorized Access'}), borrowController.listOverdueBooks);

// Extra: to get all active borrowing processes
router.get('/borrows', basicAuthenti({ users: { 'admin': 'let.me.in' }, challenge: true, unauthorizedResponse: (req) => 'Unauthorized Access'}), borrowController.listAllBorrows);

// Bonus: Export all borrowing processes to CSV in a specific period (Default: One Month)
router.get('/export-csv', basicAuthenti({ users: { 'admin': 'let.me.in' }, challenge: true, unauthorizedResponse: (req) => 'Unauthorized Access'}), borrowController.exportAllBorrowsToCSV);

// Bonus: Export overdue borrows of the last month to CSV
router.get('/export-overdue-csv', basicAuthenti({ users: { 'admin': 'let.me.in' }, challenge: true, unauthorizedResponse: (req) => 'Unauthorized Access'}), borrowController.exportOverdueBorrowsToCSV);




module.exports = router;
