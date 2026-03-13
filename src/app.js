require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Route imports
const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const loyaltyRoutes = require('./routes/loyaltyRoutes');
const userRoutes = require('./routes/userRoutes');

// Middleware imports
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// ── Global Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health Check ───────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Loyalty API is running.' });
});

// ── Routes ─────────────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/loyalty', loyaltyRoutes);
app.use('/user', userRoutes);

// Admin restaurant routes (alias for clarity)
app.use('/admin/restaurants', require('./routes/restaurantRoutes'));
// Admin loyalty routes
app.use('/admin/loyalty', loyaltyRoutes);

// ── Error Handling ─────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ───────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
