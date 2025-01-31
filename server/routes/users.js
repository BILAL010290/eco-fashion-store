const express = require('express');
const router = express.Router();

// @route   GET api/users
// @desc    Get all users
// @access  Private
router.get('/', async (req, res) => {
  try {
    res.json({ message: 'Users route working' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
