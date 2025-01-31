const express = require('express');
const router = express.Router();

// Route de base pour les commandes
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Route des commandes' });
});

module.exports = router;
