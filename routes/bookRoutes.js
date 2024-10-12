const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const limiter = require('../middlewares/rateLimiter');

// Route to add a new book
router.post('/books', limiter, bookController.addBook);

// Route to list all books
router.get('/books', bookController.listBooks);

// Route to update a book by ID
router.put('/books/:id', bookController.updateBook);

// Route to delete a book by ID
router.delete('/books/:id', bookController.deleteBook);

// Route to search for books
router.get('/books/search', bookController.searchBooks);

module.exports = router;
