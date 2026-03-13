const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const register = async ({ nickname, password, adminSecret }) => {
  // Determine role: if adminSecret matches env var, grant admin
  const role =
    adminSecret && adminSecret === process.env.ADMIN_SECRET ? 'admin' : 'user';

  const user = await User.create({ nickname, password, role });
  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      nickname: user.nickname,
      role: user.role,
    },
  };
};

const login = async ({ nickname, password }) => {
  // Explicitly select password for comparison
  const user = await User.findOne({ nickname }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    const error = new Error('Invalid nickname or password.');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      nickname: user.nickname,
      role: user.role,
    },
  };
};

module.exports = { register, login };
