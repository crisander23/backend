const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

module.exports = (pool) => {
  router.put('/updateProfile', async (req, res) => {
    const { email, U_PROFILEPICTURE } = req.body;

    if (!email) return res.status(400).send('Email is required');

    try {
      let profilePicturePath = null;
      if (U_PROFILEPICTURE) {
        const uploadDir = path.join(__dirname, '../uploads/profile_pictures');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        const fileName = `profile_${email}_${Date.now()}.png`;
        profilePicturePath = `/uploads/profile_pictures/${fileName}`;
        fs.writeFileSync(path.join(uploadDir, fileName), Buffer.from(U_PROFILEPICTURE, 'base64'));
      }

      await pool.query('UPDATE u_hispatients SET U_PROFILEPICTURE = ? WHERE U_EMAIL = ?', [profilePicturePath, email]);
      res.status(200).send('Profile updated successfully');
    } catch (error) {
      res.status(500).send('Error updating profile');
    }
  });

  return router;
};
