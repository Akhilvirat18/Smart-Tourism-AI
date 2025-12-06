const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  id: { type: String, required: false },
  listingId: { type: String, required: true },
  user: { type: String },
  rating: { type: Number, default: 5 },
  text: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
