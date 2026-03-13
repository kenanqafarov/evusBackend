const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const { nickname, password, adminSecret } = req.body;

    if (!nickname || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nickname and password are required.',
      });
    }

    const result = await authService.register({ nickname, password, adminSecret });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { nickname, password } = req.body;

    if (!nickname || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nickname and password are required.',
      });
    }

    const result = await authService.login({ nickname, password });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
