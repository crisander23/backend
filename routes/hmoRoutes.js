const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  router.post('/saveHMOInfo', async (req, res) => {
    const { CODE, U_HMO_HEALTHCAREPROVIDER } = req.body;

    try {
      await pool.query('INSERT INTO ne_hispatientshmoinfos (CODE, U_HMO_HEALTHCAREPROVIDER) VALUES (?, ?)', [CODE, U_HMO_HEALTHCAREPROVIDER]);
      res.status(200).json({ message: 'HMO Data saved successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error inserting HMO data' });
    }
  });

  return router;
};
