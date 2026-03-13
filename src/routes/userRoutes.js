const express = require('express');
const router = express.Router();
const loyaltyController = require('../controllers/loyaltyController');
const { protect } = require('../middleware/auth');

// GET /user/cards — returns all loyalty cards for the authenticated user
router.get('/cards', protect, loyaltyController.getUserCards);

// GET /user/me — returns current user profile
router.get('/me', protect, (req, res) => {
  res.status(200).json({ success: true, data: req.user });
});

module.exports = router;
