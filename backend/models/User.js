const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: { type: String, required: false },
  name: { type: String },
  email: { type: String, required: false, index: true, unique: false },
  passwordHash: { type: String },
  role: { type: String, default: 'user' }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
