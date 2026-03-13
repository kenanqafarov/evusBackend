// loyaltyService.js
const mongoose = require('mongoose');
const Loyalty = require('../models/Loyalty');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');

/**
 * Join a restaurant loyalty program.
 * Accepts either a restaurantId (ObjectId) or a registerLink (unique code).
 */
const joinRestaurant = async (userId, { restaurantId, registerLink }) => {
  let restaurant;

  if (restaurantId) {
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      const error = new Error('Invalid restaurantId format.');
      error.statusCode = 400;
      throw error;
    }
    restaurant = await Restaurant.findById(restaurantId);
  } else if (registerLink) {
    restaurant = await Restaurant.findOne({ registerLink });
  } else {
    const error = new Error('Provide either restaurantId or registerLink.');
    error.statusCode = 400;
    throw error;
  }

  if (!restaurant) {
    const error = new Error('Restaurant not found.');
    error.statusCode = 404;
    throw error;
  }

  const existing = await Loyalty.findOne({ userId, restaurantId: restaurant._id });
  if (existing) {
    const error = new Error('You are already a member of this loyalty program.');
    error.statusCode = 409;
    throw error;
  }

  const loyalty = await Loyalty.create({ userId, restaurantId: restaurant._id });

  await User.findByIdAndUpdate(userId, {
    $push: { loyaltyCards: loyalty._id },
  });

  return loyalty.populate('restaurantId', 'name icon logoUrl registerLink');
};

/**
 * Get all loyalty cards for a user, populated with restaurant details.
 */
const getUserCards = async (userId) => {
  return Loyalty.find({ userId })
    .populate('restaurantId', 'name icon logoUrl registerLink createdAt')
    .sort({ joinDate: -1 });
};

/**
 * Admin: Issue points to a loyalty card.
 */
const issuePoints = async (loyaltyId, { points, visits }) => {
  const loyalty = await Loyalty.findById(loyaltyId);
  if (!loyalty) {
    const error = new Error('Loyalty card not found.');
    error.statusCode = 404;
    throw error;
  }

  if (points) loyalty.pointsBalance += points;
  if (visits) loyalty.visitCount += visits;

  await loyalty.save();
  return loyalty.populate('restaurantId', 'name icon logoUrl');
};

/**
 * Admin: Get all loyalty cards (optionally filtered by restaurantId).
 */
const getAllCards = async ({ restaurantId } = {}) => {
  const filter = restaurantId ? { restaurantId } : {};
  return Loyalty.find(filter)
    .populate('userId', 'nickname')
    .populate('restaurantId', 'name icon logoUrl')
    .sort({ joinDate: -1 });
};

module.exports = { joinRestaurant, getUserCards, issuePoints, getAllCards };