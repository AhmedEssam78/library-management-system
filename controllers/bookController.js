const { Book } = require('../models');

// Add a new book
exports.addBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// List all books
exports.listBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a book by ID
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    await book.update(req.body);
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a book by ID
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    await book.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search books by title, author, or ISBN
exports.searchBooks = async (req, res) => {
  try {
    const { title, author, ISBN } = req.query;
    const query = {};

    if (title) query.title = title;
    if (author) query.author = author;
    if (ISBN) query.ISBN = ISBN;

    const books = await Book.findAll({ where: query });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
