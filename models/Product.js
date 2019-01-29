const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  kcal: Number,
  proteins: Number,
  fats: Number,
  carboh: Number,
  created: { type: Date, default: Date.now }
});

mongoose.model('Product', ProductSchema);

module.exports = mongoose.model('Product');