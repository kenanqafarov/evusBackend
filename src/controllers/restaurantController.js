const restaurantService = require('../services/restaurantService');

const getAllRestaurants = async (req, res, next) => {
  try {
    const restaurants = await restaurantService.getAllRestaurants();
    res.status(200).json({ success: true, count: restaurants.length, data: restaurants });
  } catch (error) {
    next(error);
  }
};

const getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await restaurantService.getRestaurantById(req.params.id);
    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    next(error);
  }
};

const createRestaurant = async (req, res, next) => {
  try {
    const { name, icon, registerLink } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Restaurant name is required.' });
    }
    const restaurant = await restaurantService.createRestaurant({ name, icon, registerLink });
    res.status(201).json({ success: true, data: restaurant });
  } catch (error) {
    next(error);
  }
};

const updateRestaurant = async (req, res, next) => {
  try {
    const restaurant = await restaurantService.updateRestaurant(req.params.id, req.body);
    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    next(error);
  }
};

const deleteRestaurant = async (req, res, next) => {
  try {
    await restaurantService.deleteRestaurant(req.params.id);
    res.status(200).json({ success: true, message: 'Restaurant deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
