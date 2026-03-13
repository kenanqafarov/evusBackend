const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { protect, adminOnly } = require('../middleware/auth');

// GET /restaurants — public
router.get('/', restaurantController.getAllRestaurants);

// GET /restaurants/:id — public
router.get('/:id', restaurantController.getRestaurantById);

// Admin-only routes
// POST /admin/restaurants
// PUT  /admin/restaurants/:id
// DELETE /admin/restaurants/:id
router.post('/', protect, adminOnly, restaurantController.createRestaurant);
router.put('/:id', protect, adminOnly, restaurantController.updateRestaurant);
router.delete('/:id', protect, adminOnly, restaurantController.deleteRestaurant);

module.exports = router;
