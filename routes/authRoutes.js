const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const hashPassword = (password) => crypto.createHash('md5').update(password).digest('hex');

module.exports = (pool) => {
  router.post('/registerPatient', async (req, res) => {
    const { U_FIRSTNAME, U_LASTNAME, U_EMAIL, email, password } = req.body;
    if (!email || !password) return res.status(400).send('Email and password are required');

    try {
      const hashedPassword = hashPassword(password);
      const NAME = `${U_LASTNAME}, ${U_FIRSTNAME}`.toUpperCase();
      await pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [NAME, email, hashedPassword]);

      res.status(200).send('Patient registered successfully');
    } catch (error) {
      res.status(500).send('Error registering patient');
    }
  });

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send('Email and password are required');

    try {
      const hashedPassword = hashPassword(password);
      const [userResults] = await pool.query('SELECT id FROM users WHERE email = ? AND password = ?', [email, hashedPassword]);

      if (userResults.length > 0) {
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).send('Invalid credentials');
      }
    } catch (error) {
      res.status(500).send('Error during login');
    }
  });

  return router;
};
