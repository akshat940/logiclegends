const mongoose = require('mongoose');
const config = require('./config');

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('connected', () => {
  console.log('MongoDB connected');
});
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

module.exports = mongoose;
