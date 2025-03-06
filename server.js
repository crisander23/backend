const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
const port = 5572;
const path = require('path');

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const pool = mysql.createPool({
  host: '120.28.166.211',
  user: 'root',
  password: 'root',
  database: 'patient_portal',
  port: 5568,
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
