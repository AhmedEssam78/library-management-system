const express = require('express');
const app = express();
const bookRoutes = require('./routes/bookRoutes');
const borrowerRoutes = require('./routes/borrowerRoutes');


// Middleware to parse JSON
app.use(express.json());

// Connect Book routes
app.use('/api', bookRoutes);
// Connect Borrower routes
app.use('/api', borrowerRoutes);


// Default error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
