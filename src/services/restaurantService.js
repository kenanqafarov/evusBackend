const Restaurant = require('../models/Restaurant');

const getAllRestaurants = async () => {
  return Restaurant.find().sort({ createdAt: -1 });
};

const getRestaurantById = async (id) => {
  const restaurant = await Restaurant.findById(id);
  if (!restaurant) {
    const error = new Error('Restaurant not found.');
    error.statusCode = 404;
    throw error;
  }
  return restaurant;
};

const createRestaurant = async ({ name, icon, registerLink }) => {
  return Restaurant.create({ name, icon, registerLink });
};

const updateRestaurant = async (id, updateData) => {
  const restaurant = await Restaurant.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!restaurant) {
    const error = new Error('Restaurant not found.');
    error.statusCode = 404;
    throw error;
  }
  return restaurant;
};

const deleteRestaurant = async (id) => {
  const restaurant = await Restaurant.findByIdAndDelete(id);
  if (!restaurant) {
    const error = new Error('Restaurant not found.');
    error.statusCode = 404;
    throw error;
  }
  return restaurant;
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
