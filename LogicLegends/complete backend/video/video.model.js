const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // S3 key
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedAt: { type: Date, default: Date.now },
  metadata: {
    duration: Number,
    resolution: String,
    // Add more video metadata if needed
  },
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
