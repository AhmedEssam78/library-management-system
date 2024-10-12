const express = require('express');
const router = express.Router();
const borrowerController = require('../controllers/borrowerController');
const limiter = require('../middlewares/rateLimiter');
const basicAuthen = require('express-basic-auth');

// Route to register a new borrower
router.post('/borrowers', limiter, borrowerController.addBorrower);

// Route to list all borrowers
router.get('/borrowers', borrowerController.listBorrowers);

// Route to update a borrower by ID
router.put('/borrowers/:id', basicAuthen({ users: { 'admin': 'let.me.in' }, challenge: true, unauthorizedResponse: (req) => 'Unauthorized Access'}), borrowerController.updateBorrower);

// Route to delete a borrower by ID
router.delete('/borrowers/:id', basicAuthen({ users: { 'admin': 'let.me.in' }, challenge: true, unauthorizedResponse: (req) => 'Unauthorized Access'}), borrowerController.deleteBorrower);

module.exports = router;
