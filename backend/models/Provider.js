const mongoose = require('mongoose');

const ProviderSchema = new mongoose.Schema({
  id: { type: String, required: false },
  name: { type: String },
  verified: { type: Boolean, default: false }
});

module.exports = mongoose.models.Provider || mongoose.model('Provider', ProviderSchema);
