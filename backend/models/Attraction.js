const mongoose = require('mongoose');

const AttractionSchema = new mongoose.Schema({
  id: { type: String, required: false },
  name: { type: String, required: true },
  img: { type: String },
  lat: { type: Number },
  lon: { type: Number },
  category: { type: String },
  duration_mins: { type: Number },
  rating: { type: Number }
});

module.exports = mongoose.models.Attraction || mongoose.model('Attraction', AttractionSchema);
