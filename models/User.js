const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  age: Number,
  weight: Number,
  height: Number,
  goal: Number,
  created: { type: Date, default: Date.now }
});

mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');