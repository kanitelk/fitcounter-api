const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mass: Number,
  kcal: Number,
  eatType: String,
  date: { type: Date, default: Date.now }
});

mongoose.model('Note', NoteSchema);

module.exports = mongoose.model('Note');