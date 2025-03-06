const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Load .env variables

const app = express();
const port = process.env.PORT || 5572; // Use env variable or default to 5572

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create a database connection pool using .env variables
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Global error handling for large payloads
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    res.status(413).send('Payload too large. Maximum allowed size is 10MB.');
  } else {
    next(err);
  }
});

// Import routes
app.use('/data', require('./routes/dataRoutes')(pool));
app.use('/auth', require('./routes/authRoutes')(pool));
app.use('/profile', require('./routes/profileRoutes')(pool));
app.use('/hmo', require('./routes/hmoRoutes')(pool));

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
