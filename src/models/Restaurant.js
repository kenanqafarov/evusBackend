const mongoose = require('mongoose');
const crypto = require('crypto');

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    icon: {
      type: String,
      default: '🍽️',
      trim: true,
    },
    registerLink: {
      type: String,
      unique: true,
      // Auto-generated if not provided
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

// Auto-generate a unique registerLink before saving
restaurantSchema.pre('save', function (next) {
  if (!this.registerLink) {
    this.registerLink = crypto.randomBytes(8).toString('hex');
  }
  next();
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
