const { Borrower } = require('../models');
const { check, validationResult } = require('express-validator');


// Register a new borrower with validation
exports.addBorrower = [
  // Validation middleware
  [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Invalid email address'),
    check('registered_date').isDate().withMessage('Registered date must be a valid date')
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const borrower = await Borrower.create(req.body);
      res.status(201).json(borrower);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];


// List all borrowers
exports.listBorrowers = async (req, res) => {
  try {
    const borrowers = await Borrower.findAll();
    res.status(200).json(borrowers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a borrower by ID
exports.updateBorrower = async (req, res) => {
  try {
    const borrower = await Borrower.findByPk(req.params.id);
    if (!borrower) {
      return res.status(404).json({ error: 'Borrower not found' });
    }
    await borrower.update(req.body);
    res.status(200).json(borrower);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a borrower by ID
exports.deleteBorrower = async (req, res) => {
  try {
    const borrower = await Borrower.findByPk(req.params.id);
    if (!borrower) {
      return res.status(404).json({ error: 'Borrower not found' });
    }
    await borrower.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
