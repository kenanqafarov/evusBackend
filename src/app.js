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

// ── CORS Sazlamaları (Dəqiq Origin Uyğunluğu) ──────────────────────
const allowedOrigins = [
  'http://localhost:8080',
  'https://evus.onrender.com',
  'https://evus.vercel.app', // Slash silindi
  'http://192.168.1.170:8080'
];

// Əgər .env-də FRONTEND_URL varsa, onu da massivə təmiz şəkildə əlavə edirik
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, "")); 
}

app.use(cors({
  origin: function (origin, callback) {
    // Brauzer xaricindən (Postman) gələn müraciətlərə və ya siyahıdakı origin-lərə icazə ver
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS xətası: ${origin} mənbəyinə icazə verilmir.`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// ── Global Middleware ──────────────────────────────────────────────
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

// Admin routes
app.use('/admin/restaurants', restaurantRoutes);
app.use('/admin/loyalty', loyaltyRoutes);

// ── Error Handling (Route-lardan SONRA gəlməlidir) ─────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ───────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;