const rateLimit = require('express-rate-limit');

// Create rate limiter middleware: 3 requests per 6 seconds
const limiter = rateLimit({
  windowMs: 6 * 1000,  // 6 seconds
  max: 3,              // Limit each IP to 3 requests per `windowMs`
  message: "Too many requests, please try again in a few seconds.",
  headers: true,       // Send rate limit info in the headers
});

module.exports = limiter;
