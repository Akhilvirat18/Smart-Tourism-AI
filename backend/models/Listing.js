const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  id: { type: String, required: false },
  title: { type: String, required: true },
  price: { type: Number, default: 0 },
  provider: { type: String },
  stock: { type: Number, default: 0 },
  category: { type: String },
  img: { type: String }
});

module.exports = mongoose.models.Listing || mongoose.model('Listing', ListingSchema);
