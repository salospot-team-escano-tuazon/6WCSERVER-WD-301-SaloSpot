const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    restaurant_id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    cuisine: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    contact: { type: String, trim: true, default: '' },
    // "approved" listings are public. "pending" is for the future Submit a Place review flow.
    status: { type: String, enum: ['approved', 'pending'], default: 'approved' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema, 'restaurants');