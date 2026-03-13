const loyaltyService = require('../services/loyaltyService');

const joinRestaurant = async (req, res, next) => {
  try {
    const { restaurantId, registerLink } = req.body;
    const loyalty = await loyaltyService.joinRestaurant(req.user._id, {
      restaurantId,
      registerLink,
    });
    res.status(201).json({ success: true, data: loyalty });
  } catch (error) {
    next(error);
  }
};

const getUserCards = async (req, res, next) => {
  try {
    const cards = await loyaltyService.getUserCards(req.user._id);
    res.status(200).json({ success: true, count: cards.length, data: cards });
  } catch (error) {
    next(error);
  }
};

// Admin: issue points/visits to a loyalty card
const issuePoints = async (req, res, next) => {
  try {
    const { loyaltyId } = req.params;
    const { points, visits } = req.body;
    const loyalty = await loyaltyService.issuePoints(loyaltyId, { points, visits });
    res.status(200).json({ success: true, data: loyalty });
  } catch (error) {
    next(error);
  }
};

// Admin: list all loyalty cards
const getAllCards = async (req, res, next) => {
  try {
    const { restaurantId } = req.query;
    const cards = await loyaltyService.getAllCards({ restaurantId });
    res.status(200).json({ success: true, count: cards.length, data: cards });
  } catch (error) {
    next(error);
  }
};

module.exports = { joinRestaurant, getUserCards, issuePoints, getAllCards };
