const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  speed: Number,
  strength: Number,
  agility: Number,
  endurance: Number,
  // Add more performance metrics as needed
}, { _id: false });

const athleteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  name: { type: String, required: true },
  age: Number,
  sport: String,
  stats: statsSchema,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Athlete = mongoose.model('Athlete', athleteSchema);

module.exports = Athlete;
