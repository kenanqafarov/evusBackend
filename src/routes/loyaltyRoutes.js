const express = require('express');
const router = express.Router();
const loyaltyController = require('../controllers/loyaltyController');
const { protect, adminOnly } = require('../middleware/auth');

// User routes
// POST /loyalty/join
router.post('/join', protect, loyaltyController.joinRestaurant);

// GET /user/cards  (mounted separately in app.js, but service is shared)
// — handled via userRoutes.js

// Admin routes
// GET  /admin/loyalty
router.get('/', protect, adminOnly, loyaltyController.getAllCards);

// PATCH /admin/loyalty/:loyaltyId/points
router.patch('/:loyaltyId/points', protect, adminOnly, loyaltyController.issuePoints);

module.exports = router;
