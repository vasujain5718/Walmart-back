const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // Will hash using bcrypt
  role: { type: String, enum: ['admin', 'delivery'], required: true }
});

module.exports = mongoose.model('User', UserSchema);
