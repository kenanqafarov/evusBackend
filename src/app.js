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

// ── CORS Sazlamaları (Frontend xətası almamaları üçün) ──────────────
const allowedOrigins = [
  'http://localhost:8080', // Vite/React üçün yerli port
  'http://localhost:3000',
  'https://evus.vercel.app/',
  'http://192.168.1.170:8080/',
  process.env.FRONTEND_URL  // Render-də mühit dəyişəni olaraq əlavə edəcəyin frontend linki
];

app.use(cors({
  origin: function (origin, callback) {
    // Brauzer xaricindən (məs: Postman) gələn müraciətlərə icazə ver
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS xətası: Bu mənbəyə icazə verilmir.'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ── Global Middleware ──────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health Check (Render-in serveri yoxlaması üçün vacibdir) ───────
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Loyalty API is running.' });
});

// ── Routes ─────────────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/loyalty', loyaltyRoutes);
app.use('/user', userRoutes);

// Admin routes
app.use('/admin/restaurants', restaurantRoutes);
app.use('/admin/loyalty', loyaltyRoutes);

// ── Error Handling ─────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ───────────────────────────────────────────────────
// Render-də PORT dəyişəni avtomatik verilir, ona görə process.env.PORT vacibdir
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;