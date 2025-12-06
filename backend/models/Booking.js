const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  id: { type: String, required: false },
  listingId: { type: String, required: true },
  qty: { type: Number, default: 1 },
  buyer: { type: String },
  totalPrice: { type: Number },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
