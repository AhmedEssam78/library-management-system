const express = require('express');
const app = express();
const bookRoutes = require('./routes/bookRoutes');

// Middleware to parse JSON
app.use(express.json());

// Use the book routes for any requests to /api/books
app.use('/api', bookRoutes);

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
