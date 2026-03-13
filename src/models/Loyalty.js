const mongoose = require('mongoose');

const loyaltySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    pointsBalance: {
      type: Number,
      default: 0,
      min: [0, 'Points cannot be negative'],
    },
    visitCount: {
      type: Number,
      default: 0,
      min: [0, 'Visit count cannot be negative'],
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index: one loyalty card per user per restaurant
loyaltySchema.index({ userId: 1, restaurantId: 1 }, { unique: true });

module.exports = mongoose.model('Loyalty', loyaltySchema);
