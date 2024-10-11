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

// Extra: to get all borrow processes
router.get('/borrows', borrowController.listAllBorrows);


module.exports = router;
